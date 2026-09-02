(() => {
  const css=document.createElement('link');css.rel='stylesheet';css.href='./v5.css?v=5';document.head.appendChild(css);

  const previews=[
    {selector:'.store-visual',key:'store',url:'https://store.m4i.ma/',title:'M4I Store',featured:true},
    {selector:'.hosting-photo',key:'hosting',url:'https://hostingg.m4i.ma/',title:'M4I Hosting'},
    {selector:'.roleplay-visual',key:'roleplay',url:'https://app.m4i.ma/',title:'MKS RolePlay'},
    {selector:'.portal-visual',key:'mks',url:'https://mks.m4i.ma/',title:'MKS Platform'},
    {selector:'.dashboard-visual',key:'dashboard',url:'https://dashboard.m4i.ma/',title:'M4I Dashboard'},
    {selector:'.elevator-photo',key:'delta',url:'https://delta-ascenseur.m4i.ma/',title:'Delta Ascenseur'},
    {selector:'.nightmare-visual',key:'nightmare',url:'https://nightmare.m4i.ma/',title:'NIGHTMARE'}
  ];
  previews.forEach(item=>{
    const el=document.querySelector(item.selector);if(!el)return;
    el.removeAttribute('aria-hidden');el.className=(item.featured?'store-visual ':'project-visual ')+'website-shot interactive-shot'+(item.featured?' featured-shot':'');
    el.setAttribute('role','button');el.tabIndex=0;el.dataset.previewProject=item.key;el.dataset.previewUrl=item.url;el.dataset.previewTitle=item.title;
    const width=item.featured?1600:1200,crop=item.featured?900:800;
    el.innerHTML=`<img src="https://image.thum.io/get/width/${width}/crop/${crop}/noanimate/${item.url}" alt="Preview of ${item.title} website" loading="lazy" referrerpolicy="no-referrer"><div class="shot-overlay"></div>${item.featured?'<div class="browser-chrome"><span></span><span></span><span></span><b>store.m4i.ma</b></div>':''}<div class="visual-domain">${item.url.replace(/^https?:\/\//,'')}</div><div class="visual-label">LIVE WEBSITE PREVIEW</div>`;
  });

  const intro=document.querySelector('.status-intro');if(intro)intro.id='statusIntro';
  if(!document.getElementById('incidentBanner')&&intro){const b=document.createElement('div');b.className='incident-banner reveal hidden';b.id='incidentBanner';b.setAttribute('role','status');intro.after(b);}
  if(!document.getElementById('previewModal')){
    const holder=document.createElement('div');
    holder.innerHTML=`<div class="preview-modal" id="previewModal" aria-hidden="true"><div class="preview-backdrop" data-close-preview></div><article class="preview-card" role="dialog" aria-modal="true" aria-labelledby="previewTitle"><button class="preview-close" type="button" data-close-preview aria-label="Close">×</button><div class="preview-head"><div><small>LIVE WEBSITE PREVIEW</small><h2 id="previewTitle">Project</h2><p id="previewDomain"></p></div><span class="preview-live"><i></i> LIVE</span></div><div class="preview-screen"><img id="previewImage" alt="Website preview"><div class="preview-sheen"></div></div><div class="preview-actions"><a class="button primary small" id="previewOpenSite" target="_blank" rel="noreferrer">Open live website ↗</a><button class="button secondary small" id="previewProjectDetails" type="button">Project details</button></div></article></div>`;
    document.body.insertBefore(holder.firstElementChild,document.getElementById('toast'));
  }
  const statusBoard = document.getElementById('statusBoard');
  const refreshButton = document.getElementById('refreshStatus');
  const legacyRows = [...document.querySelectorAll('.service-row')];
  statusBoard?.classList.add('v5-loading');
  legacyRows.forEach(row => {row.classList.add('service-row-v5');row.classList.remove('service-row');});

  const STATUS_FEEDS = location.hostname === 'm4i-store.github.io'
    ? ['https://raw.githubusercontent.com/m4i-store/momo_portfolio/status-data/status.json']
    : ['/status.json', 'https://raw.githubusercontent.com/m4i-store/momo_portfolio/status-data/status.json'];
  const HOURS = 72;
  let statusData = null;
  const catalog = {
    store:{name:'M4I Store',url:'https://store.m4i.ma/',kind:'M4I product',description:'Flagship commerce surface for M4I products and FiveM systems.'},
    hosting:{name:'M4I Hosting',url:'https://hostingg.m4i.ma/',kind:'M4I product',description:'Infrastructure and hosting service surface under the M4I brand.'},
    app:{name:'MKS RolePlay',url:'https://app.m4i.ma/',kind:'M4I platform',description:'RolePlay platform and community-facing experience.'},
    mks:{name:'MKS Platform',url:'https://mks.m4i.ma/',kind:'M4I platform',description:'Community and member operations surface.'},
    dashboard:{name:'M4I Dashboard',url:'https://dashboard.m4i.ma/',kind:'Operations',description:'Monitoring, administration and daily control interface.'},
    delta:{name:'Delta Ascenseur',url:'https://delta-ascenseur.m4i.ma/',kind:'Client work',description:'Client website for elevator services, maintenance and 24/7 assistance.'},
    nightmare:{name:'NIGHTMARE',url:'https://nightmare.m4i.ma/',kind:'Client work',description:'Custom web project delivered through the M4I build process.'}
  };

  const isArabic = () => document.documentElement.lang === 'ar';
  const stateLabel = state => ({operational:isArabic()?'متاح':'Operational',degraded:isArabic()?'أداء متراجع':'Degraded performance',partial_outage:isArabic()?'عطل جزئي':'Partial outage',major_outage:isArabic()?'عطل كبير':'Major outage',checking:isArabic()?'جارٍ التحديث':'Updating'})[state] || state;

  function patchStatusCopy(){
    const intro = document.getElementById('statusIntro');
    if(intro) intro.textContent = isArabic()
      ? 'مراقبة مستقلة تفحص كل خدمة كل 5 دقائق، تعيد المحاولة عند الفشل، تسجل الحوادث وتحتفظ بآخر 72 ساعة. الصفحة تحدث البيانات المركزية تلقائياً ولا تعتمد على متصفحك لتقرر هل الخدمة تعمل أم لا.'
      : 'Independent monitoring checks every service every 5 minutes, retries failures, records incidents and keeps the last 72 hours. This page refreshes the central feed automatically — it does not rely on your browser to decide whether a service is online.';
    const heads = document.querySelectorAll('.status-board-head span');if(heads[1]) heads[1].textContent = isArabic() ? 'آخر 72 ساعة' : 'Last 72 hours';
    const btnText = refreshButton?.querySelector('span');if(btnText) btnText.textContent = isArabic() ? 'تحديث الحالة' : 'Refresh status';
  }

  function setState(row,state,ms){
    const pill=row.querySelector('.service-state'),text=pill?.querySelector('span'),response=row.querySelector('.response-time');if(!pill||!text||!response)return;
    pill.classList.remove('checking','operational','down');if(state==='operational')pill.classList.add('operational');else if(state==='major_outage')pill.classList.add('down');else pill.classList.add('checking');
    text.textContent=stateLabel(state);response.textContent=Number.isFinite(ms)?`${Math.max(1,Math.round(ms))} ms`:'—';row.dataset.currentState=state;
  }
  function buckets(history){
    const now=Date.now(),hours=Array.from({length:HOURS},()=>[]);(history||[]).forEach(sample=>{const age=Math.floor((now-(sample.ts||0)*1000)/3600000);if(age>=0&&age<HOURS)hours[HOURS-1-age].push(sample);});
    return hours.map(hour=>{if(!hour.length)return null;if(hour.some(x=>x.state==='major_outage'))return'major_outage';if(hour.some(x=>x.state==='degraded'))return'degraded';return'operational';});
  }
  function renderBars(row,history){
    const box=row.querySelector('.uptime-bars');if(!box)return;box.innerHTML='';buckets(history).forEach((state,index)=>{const bar=document.createElement('i');bar.className=state==='operational'?'good':state==='degraded'?'degraded':state==='major_outage'?'bad':'unknown';const ago=HOURS-1-index;bar.title=state?`${ago===0?(isArabic()?'الساعة الحالية':'Current hour'):ago+(isArabic()?'س مضت':'h ago')} · ${stateLabel(state)}`:`${ago===0?(isArabic()?'الساعة الحالية':'Current hour'):ago+(isArabic()?'س مضت':'h ago')} · ${isArabic()?'لا توجد بيانات':'No data'}`;box.appendChild(bar);});
  }
  async function loadFeed(){
    for(const base of STATUS_FEEDS){try{const res=await fetch(`${base}${base.includes('?')?'&':'?'}t=${Date.now()}`,{cache:'no-store'});if(!res.ok)continue;const data=await res.json();if(data?.schema>=2&&data?.services)return data;}catch{}}
    throw new Error('central status feed unavailable');
  }
  function renderIncident(data){
    const el=document.getElementById('incidentBanner');if(!el)return;const open=(data.incidents||[]).filter(i=>i.status==='open');
    if(!open.length&&data.overall?.state==='operational'){el.className='incident-banner reveal hidden';el.innerHTML='';return;}
    el.className=`incident-banner reveal ${data.overall?.state==='degraded'?'degraded':''}`;
    if(open.length){const incident=open[0];el.innerHTML=`<strong>${incident.title}</strong><span>${isArabic()?'بدأ':'Started'} ${new Date(incident.started_at).toLocaleString()}</span>`;}
    else el.innerHTML=`<strong>${stateLabel(data.overall?.state)}</strong><span>${isArabic()?'بعض الخدمات تحتاج الانتباه':'Some services need attention'}</span>`;
  }
  function render(data){
    statusData=data;document.querySelectorAll('.service-row-v5').forEach(row=>{const svc=data.services?.[row.dataset.service];if(!svc){setState(row,'checking');renderBars(row,[]);return;}setState(row,svc.state,svc.latency_ms);renderBars(row,svc.history||[]);});
    const state=data.overall?.state||'checking',summary=document.getElementById('summaryText'),dot=document.getElementById('summaryDot');if(summary)summary.textContent=stateLabel(state);if(dot)dot.style.background=state==='operational'?'var(--green)':state==='degraded'?'var(--gold)':state==='checking'?'var(--gold)':'var(--red)';
    const time=document.getElementById('lastChecked');if(time)time.textContent=data.generated_at?`${isArabic()?'آخر تحديث':'Updated'} · ${new Date(data.generated_at).toLocaleString([], {month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'})}`:'—';renderIncident(data);
  }
  async function refresh(showError=false){
    if(refreshButton)refreshButton.disabled=true;try{render(await loadFeed());}catch{document.querySelectorAll('.service-row-v5').forEach(row=>{setState(row,'checking');renderBars(row,[]);});if(showError&&typeof showToast==='function')showToast(isArabic()?'تعذر تحميل مركز الحالة الآن.':'Could not load the central status feed right now.');}finally{if(refreshButton)refreshButton.disabled=false;statusBoard?.classList.remove('v5-loading');}
  }
  function openStatusDetails(key){
    const meta=catalog[key],svc=statusData?.services?.[key];if(!meta)return;const incidents=(statusData?.incidents||[]).filter(i=>i.service_id===key),incident=incidents[0];
    document.getElementById('modalType').textContent='STATUS';document.getElementById('modalTitle').textContent=meta.name;document.getElementById('modalSummary').textContent=(isArabic()?'مراقبة مركزية مستقلة عن المتصفح · ':'Central monitoring independent of this browser · ')+meta.description;document.getElementById('modalRole').textContent=meta.url.replace(/^https?:\/\//,'');document.getElementById('modalStatus').textContent=svc?stateLabel(svc.state):(isArabic()?'غير متاح':'Unavailable');document.getElementById('modalStack').textContent=svc?.availability_72h!=null?`${svc.availability_72h}% / 72h`:'—';
    const body=[];body.push(`<p>${meta.kind}</p><ul>`);body.push(`<li><strong>${isArabic()?'آخر فحص':'Last check'}:</strong> ${svc?.checked_at?new Date(svc.checked_at).toLocaleString():'—'}</li>`);body.push(`<li><strong>${isArabic()?'الاستجابة':'Response'}:</strong> ${svc?.latency_ms!=null?svc.latency_ms+' ms':'—'}</li>`);body.push(`<li><strong>HTTP:</strong> ${svc?.http_status??'—'}</li>`);body.push(`<li><strong>${isArabic()?'التوفر خلال 72 ساعة':'72h availability'}:</strong> ${svc?.availability_72h!=null?svc.availability_72h+'%':'—'}</li>`);if(svc?.error)body.push(`<li><strong>${isArabic()?'آخر خطأ':'Last error'}:</strong> ${svc.error}</li>`);body.push('</ul>');if(incident)body.push(`<p><strong>${isArabic()?'آخر حادثة':'Latest incident'}:</strong> ${incident.title} · ${incident.status==='open'?stateLabel('major_outage'):(isArabic()?'تم الحل':'Resolved')}</p>`);document.getElementById('modalBody').innerHTML=body.join('');
    const actions=document.getElementById('modalActions');actions.innerHTML='';const open=document.createElement('a');open.className='button primary small';open.href=meta.url;open.target='_blank';open.rel='noreferrer';open.textContent=isArabic()?'فتح الموقع ↗':'Open website ↗';actions.appendChild(open);const update=document.createElement('button');update.className='button secondary small';update.type='button';update.textContent=isArabic()?'تحديث البيانات':'Refresh status';update.addEventListener('click',async()=>{await refresh(true);openStatusDetails(key);});actions.appendChild(update);document.getElementById('projectModal').classList.add('open');document.getElementById('projectModal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  }

  const previewModal=document.getElementById('previewModal'),previewImage=document.getElementById('previewImage'),previewTitle=document.getElementById('previewTitle'),previewDomain=document.getElementById('previewDomain'),previewOpen=document.getElementById('previewOpenSite'),previewDetails=document.getElementById('previewProjectDetails');let previewProject=null;
  const hiRes=url=>`https://image.thum.io/get/width/1920/crop/1080/noanimate/${url}`;
  function openPreview(el){previewProject=el.dataset.previewProject;const url=el.dataset.previewUrl;previewTitle.textContent=el.dataset.previewTitle||'Website';previewDomain.textContent=url.replace(/^https?:\/\//,'');previewImage.src=hiRes(url);previewOpen.href=url;previewModal.classList.add('open');previewModal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
  function closePreview(){previewModal.classList.remove('open');previewModal.setAttribute('aria-hidden','true');previewImage.removeAttribute('src');document.body.style.overflow='';}
  document.querySelectorAll('.interactive-shot').forEach(shot=>{shot.addEventListener('click',()=>openPreview(shot));shot.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPreview(shot);}});shot.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=shot.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;shot.style.setProperty('--mx',`${x*100}%`);shot.style.setProperty('--my',`${y*100}%`);const img=shot.querySelector('img');if(img)img.style.transform=`scale(1.065) translate(${(x-.5)*-7}px,${(y-.5)*-7}px)`;});shot.addEventListener('pointerleave',()=>{const img=shot.querySelector('img');if(img)img.style.transform='';});});
  document.querySelectorAll('[data-close-preview]').forEach(el=>el.addEventListener('click',closePreview));previewDetails?.addEventListener('click',()=>{const key=previewProject;closePreview();if(key&&typeof openProject==='function')openProject(key);});
  document.querySelectorAll('.project-card,.featured-project').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--px',`${e.clientX-r.left}px`);card.style.setProperty('--py',`${e.clientY-r.top}px`);}));
  if(matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('.button,.text-button,.filter-row button').forEach(el=>{el.classList.add('magnetic');el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.08}px,${(e.clientY-r.top-r.height/2)*.08}px)`;});el.addEventListener('pointerleave',()=>el.style.transform='');});}
  const targets=[...document.querySelectorAll('main section[id]')],anchors=[...document.querySelectorAll('.nav-links a[href^="#"]')];const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)anchors.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`));}),{rootMargin:'-35% 0px -55% 0px'});targets.forEach(section=>observer.observe(section));

  setTimeout(()=>{legacyRows.forEach(row=>{row.classList.add('service-row');row.tabIndex=0;row.addEventListener('click',()=>openStatusDetails(row.dataset.service));row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openStatusDetails(row.dataset.service);}});});patchStatusCopy();refresh();},700);
  refreshButton?.addEventListener('click',e=>{e.stopImmediatePropagation();refresh(true);},{capture:true});
  document.getElementById('languageToggle')?.addEventListener('click',()=>setTimeout(()=>{patchStatusCopy();if(statusData)render(statusData);},0));
  setInterval(()=>refresh(false),60000);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&previewModal?.classList.contains('open'))closePreview();});
})();
