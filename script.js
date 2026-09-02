(()=>{
  const legacy=document.createElement('script');
  legacy.src='./script-v3.js';
  legacy.onload=()=>setTimeout(initV4,0);
  legacy.onerror=()=>initV4();
  document.head.appendChild(legacy);

  function initV4(){
    const doc=document.documentElement;
    const modalEl=document.getElementById('projectModal');
    const shot=(url,w=1200,h=800)=>`https://image.thum.io/get/width/${w}/crop/${h}/noanimate/${url}`;

    function previewMarkup(url,title,domain,featured=false){
      const cls=featured?'website-shot featured-shot':'project-visual website-shot';
      const chrome=featured?'<div class="browser-chrome"><span></span><span></span><span></span><b>'+domain+'</b></div>':'';
      return `<div class="${cls}"><img src="${shot(url,featured?1600:1200,featured?900:800)}" alt="Preview of ${title} website" loading="lazy" referrerpolicy="no-referrer"><div class="shot-overlay"></div>${chrome}<div class="visual-domain">${domain}</div><div class="visual-label">LIVE WEBSITE PREVIEW</div></div>`;
    }
    function addImageFallback(scope,domain){
      const img=scope?.querySelector('.website-shot>img'); if(!img)return;
      img.addEventListener('error',()=>{const p=img.parentElement;p.innerHTML=`<div class="preview-fallback"><b>${domain}</b><span>Live preview unavailable · open project ↗</span></div><div class="visual-domain">${domain}</div>`;},{once:true});
    }
    const featured=document.querySelector('.featured-project .store-visual');
    if(featured){featured.innerHTML=previewMarkup('https://store.m4i.ma/','M4I Store','store.m4i.ma',true);addImageFallback(featured,'store.m4i.ma');}
    const previews={
      hosting:['https://hostingg.m4i.ma/','M4I Hosting','hostingg.m4i.ma'],
      roleplay:['https://app.m4i.ma/','MKS RolePlay','app.m4i.ma'],
      mks:['https://mks.m4i.ma/','MKS Platform','mks.m4i.ma'],
      dashboard:['https://dashboard.m4i.ma/','M4I Dashboard','dashboard.m4i.ma'],
      delta:['https://delta-ascenseur.m4i.ma/','Delta Ascenseur','delta-ascenseur.m4i.ma'],
      nightmare:['https://nightmare.m4i.ma/','NIGHTMARE','nightmare.m4i.ma']
    };
    Object.entries(previews).forEach(([key,[url,title,domain]])=>{
      const btn=document.querySelector(`.open-project[data-project="${key}"]`); const card=btn?.closest('.project-card'); const old=card?.querySelector('.project-visual');
      if(old){old.outerHTML=previewMarkup(url,title,domain,false);addImageFallback(card,domain);}
    });

    const COPY={
      en:{intro:'Status is sampled at most once per hour on this browser. Each service keeps a maximum of 72 hourly checks. Click any service to see its details and local 72-hour history.',history:'Last 72 hourly checks',note:'Click a service row to open details, response information and the local 72-hour status history.'},
      ar:{intro:'يتم أخذ عينة للحالة مرة واحدة كحد أقصى كل ساعة على هذا المتصفح. كل خدمة تحتفظ بآخر 72 فحصاً ساعياً. اضغط على أي خدمة لرؤية التفاصيل وسجل آخر 72 ساعة.',history:'آخر 72 فحصاً ساعياً',note:'اضغط على أي خدمة لفتح التفاصيل ومعلومات الاستجابة وسجل الحالة المحلي لآخر 72 ساعة.'}
    };
    function syncCopy(){
      const lang=doc.lang==='ar'?'ar':'en',c=COPY[lang];
      const intro=document.querySelector('[data-i18n="status.intro"]');if(intro)intro.textContent=c.intro;
      const historyLabel=document.querySelector('[data-i18n="status.history"]');if(historyLabel)historyLabel.textContent=c.history;
      let note=document.querySelector('.status-note-v4');if(!note){note=document.createElement('p');note.className='status-note-v4 reveal visible';document.getElementById('statusBoard')?.after(note);} if(note)note.textContent=c.note;
    }
    syncCopy();
    document.getElementById('languageToggle')?.addEventListener('click',()=>setTimeout(()=>{syncCopy();V4.renderAll();},0));

    const V4={
      KEY:'m4i-status-history-v4',INTERVAL:60*60*1000,MAX:72,
      catalog:{
        store:{name:'M4I Store',url:'https://store.m4i.ma/',kind:'M4I product',description:'Flagship commerce surface for M4I products and FiveM systems.'},
        hosting:{name:'M4I Hosting',url:'https://hostingg.m4i.ma/',kind:'M4I product',description:'Infrastructure and hosting service surface under the M4I brand.'},
        app:{name:'MKS RolePlay',url:'https://app.m4i.ma/',kind:'M4I platform',description:'RolePlay platform and community-facing experience.'},
        mks:{name:'MKS Platform',url:'https://mks.m4i.ma/',kind:'M4I platform',description:'Community and member operations surface.'},
        dashboard:{name:'M4I Dashboard',url:'https://dashboard.m4i.ma/',kind:'Operations',description:'Monitoring, administration and daily control interface.'},
        delta:{name:'Delta Ascenseur',url:'https://delta-ascenseur.m4i.ma/',kind:'Client work',description:'Client website for elevator services, maintenance and 24/7 assistance.'},
        nightmare:{name:'NIGHTMARE',url:'https://nightmare.m4i.ma/',kind:'Client work',description:'Custom web project delivered through the M4I build process.'}
      },
      load(){try{return JSON.parse(localStorage.getItem(this.KEY)||'{}')}catch{return{}}},
      save(v){localStorage.setItem(this.KEY,JSON.stringify(v))},
      rows(){return[...document.querySelectorAll('.service-row')]},
      list(store,key){return Array.isArray(store[key])?store[key]:[]},
      bars(row,list){
        const box=row.querySelector('.uptime-bars');if(!box)return;box.innerHTML='';
        const padded=[...Array(Math.max(0,this.MAX-list.length)).fill(null),...list.slice(-this.MAX)];
        padded.forEach(entry=>{const i=document.createElement('i');i.className=entry===null?'unknown':entry.ok?'good':'bad';i.title=entry?`${new Date(entry.ts).toLocaleString()} · ${entry.ok?'Operational':'No response'}${entry.ms?` · ${entry.ms} ms`:''}`:'No local sample';box.appendChild(i)});
      },
      state(row,sample){
        const box=row.querySelector('.service-state'),text=box?.querySelector('span'),response=row.querySelector('.response-time');if(!box||!text)return;
        box.classList.remove('checking','operational','down');
        if(!sample){box.classList.add('checking');text.textContent=doc.lang==='ar'?'بانتظار الفحص':'Awaiting check';if(response)response.textContent='—';row.dataset.v4state='unknown';return;}
        if(sample.ok){box.classList.add('operational');text.textContent=doc.lang==='ar'?'متاح':'Operational';if(response)response.textContent=`${Math.max(1,sample.ms||1)} ms`;row.dataset.v4state='operational';}
        else{box.classList.add('down');text.textContent=doc.lang==='ar'?'لا يستجيب':'No response';if(response)response.textContent='—';row.dataset.v4state='down';}
      },
      renderAll(){
        const store=this.load(),rows=this.rows();rows.forEach(row=>{const list=this.list(store,row.dataset.service);this.bars(row,list);this.state(row,list.at(-1));row.tabIndex=0;row.setAttribute('role','button');row.setAttribute('aria-label',`${row.querySelector('.service-name b')?.textContent||row.dataset.service} status details`)});this.summary(store,rows);
      },
      summary(store,rows){
        const samples=rows.map(r=>this.list(store,r.dataset.service).at(-1)).filter(Boolean),good=samples.filter(x=>x.ok).length,total=rows.length;const text=document.getElementById('summaryText'),dot=document.getElementById('summaryDot');
        if(text){if(!samples.length)text.textContent=doc.lang==='ar'?'بانتظار أول فحص':'Awaiting first hourly check';else if(good===total)text.textContent=doc.lang==='ar'?'كل الخدمات متاحة':'All services operational';else text.textContent=doc.lang==='ar'?`${good}/${total} خدمات متاحة`:`${good}/${total} services operational`;}
        if(dot)dot.style.background=!samples.length?'var(--gold)':good===total?'var(--green)':good===0?'var(--red)':'var(--gold)';
        const last=Math.max(0,...Object.values(store).flat().map(x=>x?.ts||0));const lastEl=document.getElementById('lastChecked');if(lastEl)lastEl.textContent=last?`${doc.lang==='ar'?'آخر فحص':'Last checked'} · ${new Date(last).toLocaleString([], {month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'})}`:'—';
      },
      async probe(row){const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),8000),start=performance.now();try{await fetch(`${row.dataset.url}${row.dataset.url.includes('?')?'&':'?'}m4i_v4_probe=${Date.now()}`,{method:'GET',mode:'no-cors',cache:'no-store',signal:ctrl.signal});clearTimeout(timer);return{ok:true,ms:Math.max(1,Math.round(performance.now()-start)),ts:Date.now()}}catch(e){clearTimeout(timer);return{ok:false,ms:null,ts:Date.now()}}},
      async check(force=false){
        const store=this.load(),rows=this.rows(),latest=Math.max(0,...Object.values(store).flat().map(x=>x?.ts||0));if(!force&&latest&&Date.now()-latest<this.INTERVAL){this.renderAll();return;}
        const btn=document.getElementById('refreshStatus');if(btn)btn.disabled=true;
        const results=await Promise.all(rows.map(async row=>[row,await this.probe(row)]));
        results.forEach(([row,sample])=>{const key=row.dataset.service;store[key]=this.list(store,key);store[key].push(sample);store[key]=store[key].slice(-this.MAX)});this.save(store);this.renderAll();if(btn)btn.disabled=false;
      },
      open(key){
        const meta=this.catalog[key];if(!meta||!modalEl)return;const store=this.load(),list=this.list(store,key),ok=list.filter(x=>x.ok),bad=list.filter(x=>!x.ok),latest=list.at(-1),uptime=list.length?Math.round(ok.length/list.length*1000)/10:null,avg=ok.length?Math.round(ok.reduce((a,b)=>a+(b.ms||0),0)/ok.length):null,ar=doc.lang==='ar';
        document.getElementById('modalType').textContent='STATUS';document.getElementById('modalTitle').textContent=meta.name;document.getElementById('modalSummary').textContent=(ar?'سجل محلي لآخر 72 ساعة · ':'Local 72-hour history · ')+meta.description;document.getElementById('modalRole').textContent=meta.url.replace(/^https?:\/\//,'');document.getElementById('modalStatus').textContent=latest?(latest.ok?(ar?'متاح':'Operational'):(ar?'لا يستجيب':'No response')):(ar?'لا يوجد سجل بعد':'No samples yet');document.getElementById('modalStack').textContent=uptime===null?`0/${this.MAX} samples`:`${list.length}/${this.MAX} samples · ${uptime}% uptime`;
        const padded=[...Array(Math.max(0,this.MAX-list.length)).fill(null),...list.slice(-this.MAX)];const bars=padded.map(x=>`<i class="${x===null?'':x.ok?'good':'bad'}"></i>`).join('');
        document.getElementById('modalBody').innerHTML=`<p>${meta.kind}</p><div class="modal-status-bars">${bars}</div><div class="modal-status-meta"><span>-72h</span><span>${ar?'كل عمود = فحص ساعي':'Each bar = one hourly check'}</span><span>${ar?'الآن':'Now'}</span></div><ul><li><strong>${ar?'آخر فحص':'Last check'}:</strong> ${latest?new Date(latest.ts).toLocaleString():'—'}</li><li><strong>${ar?'متوسط الاستجابة':'Average response'}:</strong> ${avg!==null?avg+' ms':'—'}</li><li><strong>${ar?'ناجحة':'Successful'}:</strong> ${ok.length}</li><li><strong>${ar?'فاشلة':'Failed'}:</strong> ${bad.length}</li></ul><p>${ar?'هذا السجل تجريبي ومحلي داخل المتصفح حالياً؛ على VPS سيتم نقله إلى monitoring مركزي.':'This preview history is currently local to the browser; on the VPS it will be replaced by centralized monitoring.'}</p>`;
        const actions=document.getElementById('modalActions');actions.innerHTML='';const a=document.createElement('a');a.className='button primary small';a.href=meta.url;a.target='_blank';a.rel='noreferrer';a.textContent=ar?'فتح الموقع ↗':'Open website ↗';actions.appendChild(a);const b=document.createElement('button');b.className='button secondary small';b.type='button';b.textContent=ar?'فحص الآن':'Check now';b.onclick=async()=>{await this.check(true);this.open(key)};actions.appendChild(b);modalEl.classList.add('open');modalEl.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
      }
    };

    V4.renderAll();
    V4.rows().forEach(row=>{row.addEventListener('click',()=>V4.open(row.dataset.service));row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();V4.open(row.dataset.service)}})});
    const oldBtn=document.getElementById('refreshStatus');if(oldBtn){const clone=oldBtn.cloneNode(true);oldBtn.replaceWith(clone);clone.addEventListener('click',()=>V4.check(true));}
    setTimeout(()=>{V4.renderAll();V4.check(false)},1200);
    setInterval(()=>V4.check(false),V4.INTERVAL);
    window.M4IStatus72=V4;
  }
})();
