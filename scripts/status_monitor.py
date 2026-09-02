#!/usr/bin/env python3
import argparse
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

WINDOW_SECONDS = 72 * 60 * 60
MAX_INCIDENTS = 30
TIMEOUT_SECONDS = 8
RETRIES = 3
DEGRADED_LATENCY_MS = 1800

SERVICES = [
    {"id":"store","name":"M4I Store","url":"https://store.m4i.ma/","kind":"M4I Product","critical":True},
    {"id":"hosting","name":"M4I Hosting","url":"https://hostingg.m4i.ma/","kind":"M4I Product","critical":True},
    {"id":"app","name":"MKS RolePlay","url":"https://app.m4i.ma/","kind":"M4I Platform","critical":True},
    {"id":"mks","name":"MKS Platform","url":"https://mks.m4i.ma/","kind":"M4I Platform","critical":True},
    {"id":"dashboard","name":"M4I Dashboard","url":"https://dashboard.m4i.ma/","kind":"Operations","critical":True},
    {"id":"delta","name":"Delta Ascenseur","url":"https://delta-ascenseur.m4i.ma/","kind":"Client Work","critical":False},
    {"id":"nightmare","name":"NIGHTMARE","url":"https://nightmare.m4i.ma/","kind":"Client Work","critical":False},
]

def iso_now(ts=None):
    dt = datetime.fromtimestamp(ts or time.time(), tz=timezone.utc)
    return dt.isoformat().replace('+00:00', 'Z')

def load_previous(path):
    try:
        return json.loads(Path(path).read_text(encoding='utf-8'))
    except Exception:
        return {}

def append_probe_param(url):
    parts = urllib.parse.urlsplit(url)
    q = urllib.parse.parse_qsl(parts.query, keep_blank_values=True)
    q.append(("__m4i_status", str(int(time.time()))))
    return urllib.parse.urlunsplit((parts.scheme, parts.netloc, parts.path, urllib.parse.urlencode(q), parts.fragment))

def check_service(service):
    attempts = []
    for attempt in range(1, RETRIES + 1):
        started = time.monotonic()
        code = None
        error = None
        try:
            req = urllib.request.Request(
                append_probe_param(service['url']),
                headers={
                    'User-Agent': 'M4I-Status-Monitor/1.0 (+https://m4i.ma)',
                    'Accept': 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
                    'Cache-Control': 'no-cache',
                },
                method='GET',
            )
            with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as response:
                code = int(getattr(response, 'status', response.getcode()))
                response.read(1024)
        except urllib.error.HTTPError as exc:
            code = int(exc.code)
            error = f'HTTP {exc.code}'
        except Exception as exc:
            error = f'{type(exc).__name__}: {str(exc)[:140]}'
        latency_ms = round((time.monotonic() - started) * 1000)
        attempts.append({"attempt": attempt, "http_status": code, "latency_ms": latency_ms, "error": error})
        if code is not None and 200 <= code < 400:
            state = 'degraded' if latency_ms >= DEGRADED_LATENCY_MS else 'operational'
            return {"state": state, "latency_ms": latency_ms, "http_status": code, "attempts": attempts, "error": None}
        if code is not None and 400 <= code < 500:
            return {"state": 'degraded', "latency_ms": latency_ms, "http_status": code, "attempts": attempts, "error": error or f'HTTP {code}'}
        if attempt < RETRIES:
            time.sleep(1.25)
    last = attempts[-1] if attempts else {}
    return {
        "state": 'major_outage',
        "latency_ms": last.get('latency_ms'),
        "http_status": last.get('http_status'),
        "attempts": attempts,
        "error": last.get('error') or (f"HTTP {last.get('http_status')}" if last.get('http_status') else 'No response'),
    }

def transition_incidents(previous, current_states, now_ts):
    incidents = previous.get('incidents') if isinstance(previous.get('incidents'), list) else []
    incidents = [dict(i) for i in incidents if isinstance(i, dict)]
    prev_services = previous.get('services') if isinstance(previous.get('services'), dict) else {}
    for service in SERVICES:
        sid = service['id']
        new_state = current_states[sid]['state']
        open_incident = next((i for i in reversed(incidents) if i.get('service_id') == sid and i.get('status') == 'open'), None)
        if new_state == 'major_outage':
            if open_incident is None:
                incidents.append({
                    'id': f"{sid}-{int(now_ts)}",
                    'service_id': sid,
                    'service_name': service['name'],
                    'title': f"{service['name']} is not responding",
                    'status': 'open',
                    'severity': 'major_outage',
                    'started_at': iso_now(now_ts),
                    'started_at_ts': int(now_ts),
                    'last_update_at': iso_now(now_ts),
                    'message': current_states[sid].get('error') or 'Connectivity checks failed after retries.',
                })
            else:
                open_incident['last_update_at'] = iso_now(now_ts)
                open_incident['message'] = current_states[sid].get('error') or open_incident.get('message')
        elif open_incident is not None:
            open_incident['status'] = 'resolved'
            open_incident['resolved_at'] = iso_now(now_ts)
            open_incident['resolved_at_ts'] = int(now_ts)
            open_incident['duration_seconds'] = max(0, int(now_ts) - int(open_incident.get('started_at_ts') or now_ts))
            open_incident['last_update_at'] = iso_now(now_ts)
            open_incident['message'] = 'Service recovered and passed the monitor check.'
    cutoff = now_ts - WINDOW_SECONDS
    kept = []
    for incident in incidents:
        if incident.get('status') == 'open' or int(incident.get('resolved_at_ts') or incident.get('started_at_ts') or 0) >= cutoff:
            kept.append(incident)
    return kept[-MAX_INCIDENTS:]

def aggregate_overall(states):
    down = [sid for sid, value in states.items() if value['state'] == 'major_outage']
    degraded = [sid for sid, value in states.items() if value['state'] == 'degraded']
    critical_down = [sid for sid in down if next(s['critical'] for s in SERVICES if s['id'] == sid)]
    if len(critical_down) >= 3:
        state = 'major_outage'
    elif down:
        state = 'partial_outage'
    elif degraded:
        state = 'degraded'
    else:
        state = 'operational'
    return {"state": state, "down_services": down, "degraded_services": degraded}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--previous', default='status-prev.json')
    parser.add_argument('--output', default='status.json')
    args = parser.parse_args()
    previous = load_previous(args.previous)
    prev_services = previous.get('services') if isinstance(previous.get('services'), dict) else {}
    now_ts = int(time.time())
    cutoff = now_ts - WINDOW_SECONDS
    current = {}
    service_payload = {}
    for service in SERVICES:
        result = check_service(service)
        sid = service['id']
        current[sid] = result
        old_history = (prev_services.get(sid) or {}).get('history')
        if not isinstance(old_history, list):
            old_history = []
        history = [h for h in old_history if isinstance(h, dict) and int(h.get('ts') or 0) >= cutoff]
        history.append({'ts': now_ts, 'at': iso_now(now_ts), 'state': result['state'], 'latency_ms': result.get('latency_ms'), 'http_status': result.get('http_status')})
        up_count = sum(1 for h in history if h.get('state') in ('operational', 'degraded'))
        availability = round((up_count / len(history)) * 100, 3) if history else None
        service_payload[sid] = {
            'id': sid, 'name': service['name'], 'url': service['url'], 'kind': service['kind'], 'critical': service['critical'],
            'state': result['state'], 'latency_ms': result.get('latency_ms'), 'http_status': result.get('http_status'), 'error': result.get('error'),
            'checked_at': iso_now(now_ts), 'checked_at_ts': now_ts, 'attempts': result.get('attempts', []), 'availability_72h': availability, 'history': history,
        }
    incidents = transition_incidents(previous, current, now_ts)
    overall = aggregate_overall(current)
    open_incidents = [i for i in incidents if i.get('status') == 'open']
    payload = {
        'schema': 2,
        'generated_at': iso_now(now_ts),
        'generated_at_ts': now_ts,
        'monitor': {'provider': 'GitHub Actions', 'cadence_minutes': 5, 'retries_per_check': RETRIES, 'timeout_seconds': TIMEOUT_SECONDS, 'history_window_hours': 72, 'degraded_latency_ms': DEGRADED_LATENCY_MS},
        'overall': {**overall, 'open_incidents': len(open_incidents)},
        'services': service_payload,
        'incidents': list(reversed(incidents)),
    }
    Path(args.output).write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'overall': payload['overall'], 'generated_at': payload['generated_at']}, ensure_ascii=False))

if __name__ == '__main__':
    main()
