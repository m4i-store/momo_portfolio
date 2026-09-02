const root = document.documentElement;
const header = document.querySelector('.topbar');
const themeToggle = document.getElementById('themeToggle');
const languageToggle = document.getElementById('languageToggle');
const languageLabel = document.getElementById('languageLabel');
const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
const toast = document.getElementById('toast');
const modal = document.getElementById('projectModal');

const translations = {
  en: {
    'nav.momo':'MOMO','nav.ecosystem':'Ecosystem','nav.projects':'Projects','nav.status':'Status','nav.contact':'Contact',
    'hero.badge':'M4I DIGITAL ECOSYSTEM · MOROCCO','hero.title':'I build <em>products</em>, systems & digital infrastructure that feel like one brand.','hero.lede':'M4I is the ecosystem behind my platforms, tools, infrastructure and client products. I’m MOMO — the person designing the product, engineering the system and operating what ships.','hero.explore':'Explore the ecosystem','hero.status':'Live system status','hero.fact1label':'IDENTITY','hero.fact2label':'BASE','hero.fact2':'Morocco · Remote','hero.fact3label':'BUILDING','hero.fact3':'Products → Systems → Ops','hero.identity':'Product thinking. Full-stack engineering. Systems ownership.',
    'momo.eyebrow':'THE PERSON BEHIND THE BRAND','momo.title':'MOMO is the common layer.','momo.quote':'“I don’t want projects that only look good in a screenshot. I want products that work, stay understandable, and can grow without becoming chaos.”','momo.role':'Founder · Full-stack Builder · Systems Operator','momo.m1t':'Build for reality','momo.m1b':'Real permissions, real failures, real users, real operations.','momo.m2t':'Own the whole path','momo.m2b':'From brand and UX to backend, deployment, monitoring and maintenance.','momo.m3t':'Automate repetition','momo.m3b':'Keep human judgment where it matters and remove the boring loops.','momo.m4t':'Make it recognizable','momo.m4b':'Every M4I product should feel like it belongs to the same world.',
    'eco.eyebrow':'ONE BRAND · MULTIPLE LAYERS','eco.title':'The M4I ecosystem.',
    'projects.eyebrow':'PROJECT ATLAS','projects.title':'Products with a real destination.','projects.store':'A self-hosted FiveM storefront built around M4I-owned UX, Tebex Headless checkout, Cfx identity, product management, docs, customer records and operational tooling.','projects.visit':'Visit live project','projects.details':'Project details →','projects.hosting':'Infrastructure and hosting presented as an M4I product — built for a clear path from service discovery to deployment.','projects.roleplay':'A full web experience for an Arabic gaming community with applications, streamers, account flows and server operations.','projects.mks':'Community tooling, member flows and operational interfaces under the MKS ecosystem.','projects.dashboard':'An operations surface for the systems behind the brand — monitoring, administration and day-to-day control.','projects.delta':'A bilingual business website for elevator installation, maintenance, modernization and 24/7 assistance, with a structured client journey.','projects.nightmare':'A custom web project delivered under the M4I build process with its own distinct visual identity.','projects.core':'Framework-neutral, server-authoritative FiveM core designed for stable persistence, explicit ownership and predictable runtime behavior.','projects.bridge':'The universal integration layer connecting M4I resources with frameworks, inventories, UI, callbacks, security, logs and providers.','projects.identitySys':'Identity ownership for join validation, language, reconnect protection, policy decisions and runtime identity state.',
    'status.eyebrow':'LIVE REACHABILITY','status.title':'M4I Status Center.','status.intro':'This preview performs a live browser reachability probe. The visual history stores recent checks on this device; global 90-day uptime will connect to the VPS monitoring service at production launch.','status.service':'Service','status.history':'Recent probe history','status.response':'Response','status.state':'State','status.refresh':'Run live check','status.reachable':'Reachable','status.unreachable':'No response','status.unknown':'No local history',
    'contact.eyebrow':'WORK WITH M4I / TALK TO MOMO','contact.title':'Have an idea that needs more than <em>a template?</em>','contact.body':'I build complete products — interface, backend, integrations, deployment and the operational layer around them.','contact.discord':'Discord contact','contact.discordHint':'Discord link will be connected before production launch.','footer.copy':'Digital products · Systems · Infrastructure'
  },
  ar: {
    'nav.momo':'مومو','nav.ecosystem':'المنظومة','nav.projects':'المشاريع','nav.status':'الحالة','nav.contact':'تواصل',
    'hero.badge':'منظومة M4I الرقمية · المغرب','hero.title':'أبني <em>منتجات</em> وأنظمة وبنية رقمية تشعر أنها كلها من نفس الهوية.','hero.lede':'M4I هي المنظومة التي تجمع منصاتي وأدواتي وبنيتي التحتية ومشاريع العملاء. أنا MOMO — أصمم المنتج، أبني النظام، وأدير ما يتم إطلاقه.','hero.explore':'استكشف المنظومة','hero.status':'حالة الأنظمة مباشرة','hero.fact1label':'الهوية','hero.fact2label':'المقر','hero.fact2':'المغرب · عن بعد','hero.fact3label':'ما أبنيه','hero.fact3':'منتجات ← أنظمة ← تشغيل','hero.identity':'تفكير منتج. هندسة Full-stack. امتلاك كامل للنظام.',
    'momo.eyebrow':'الشخص خلف البراند','momo.title':'MOMO هو الطبقة المشتركة.','momo.quote':'«لا أريد مشاريع تبدو جميلة فقط في صورة. أريد منتجات تعمل فعلاً، تبقى مفهومة، وتكبر بدون أن تتحول إلى فوضى.»','momo.role':'المؤسس · Full-stack Builder · مشغّل أنظمة','momo.m1t':'ابنِ للواقع','momo.m1b':'صلاحيات حقيقية، أعطال حقيقية، مستخدمون حقيقيون، وتشغيل حقيقي.','momo.m2t':'امتلك المسار كاملاً','momo.m2b':'من الهوية وتجربة الاستخدام إلى الخلفية والنشر والمراقبة والصيانة.','momo.m3t':'أتمت المتكرر','momo.m3b':'اترك القرار البشري حيث يهم، واحذف الحلقات المملة.','momo.m4t':'اجعل الهوية واضحة','momo.m4b':'كل منتج من M4I يجب أن يبدو وكأنه ينتمي لنفس العالم.',
    'eco.eyebrow':'براند واحد · طبقات متعددة','eco.title':'منظومة M4I.',
    'projects.eyebrow':'أطلس المشاريع','projects.title':'منتجات لها وجهة حقيقية.','projects.store':'متجر FiveM مستضاف ذاتياً بواجهة M4I خاصة، دفع Tebex Headless، هوية Cfx، إدارة منتجات ووثائق وعملاء وأدوات تشغيل.','projects.visit':'زيارة المشروع','projects.details':'تفاصيل المشروع ←','projects.hosting':'خدمات بنية واستضافة مقدمة كمنتج M4I واضح من اكتشاف الخدمة إلى النشر.','projects.roleplay':'تجربة ويب كاملة لمجتمع ألعاب عربي تشمل الطلبات والستريمرز والحسابات وعمليات السيرفر.','projects.mks':'أدوات المجتمع ومسارات الأعضاء وواجهات التشغيل داخل منظومة MKS.','projects.dashboard':'واجهة تشغيل للأنظمة خلف البراند — مراقبة وإدارة وتحكم يومي.','projects.delta':'موقع أعمال ثنائي اللغة للتركيب والصيانة والتحديث وخدمة الطوارئ 24/7 للمصاعد، بمسار عميل واضح.','projects.nightmare':'مشروع ويب مخصص تم بناؤه بمنهجية M4I مع هوية بصرية مستقلة.','projects.core':'Core لـFiveM محايد عن الفريمورك، Server-authoritative ومصمم لاستقرار التخزين والملكية والسلوك المتوقع.','projects.bridge':'طبقة التكامل العامة التي تربط موارد M4I بالفريموركات والإنفنتوري والواجهات والكولباك والأمن والسجلات والمزوّدين.','projects.identitySys':'ملكية الهوية للتحقق قبل الدخول واللغة وحماية إعادة الاتصال وقرارات السياسة وحالة الهوية أثناء التشغيل.',
    'status.eyebrow':'وصول مباشر','status.title':'مركز حالة M4I.','status.intro':'هذه النسخة تقوم بفحص وصول مباشر من المتصفح. الشريط يحتفظ بآخر الفحوصات على هذا الجهاز؛ وعند الإطلاق على VPS سنربطه بالمراقبة المركزية لإظهار تاريخ 90 يوماً الحقيقي.','status.service':'الخدمة','status.history':'سجل الفحص الأخير','status.response':'الاستجابة','status.state':'الحالة','status.refresh':'إعادة الفحص الآن','status.reachable':'يمكن الوصول','status.unreachable':'لا توجد استجابة','status.unknown':'لا يوجد سجل محلي',
    'contact.eyebrow':'اعمل مع M4I / تواصل مع MOMO','contact.title':'عندك فكرة تحتاج أكثر من <em>قالب جاهز؟</em>','contact.body':'أبني المنتج كاملاً — الواجهة والخلفية والتكاملات والنشر وطبقة التشغيل حوله.','contact.discord':'التواصل على Discord','contact.discordHint':'سيتم ربط Discord الحقيقي قبل الإطلاق النهائي.','footer.copy':'منتجات رقمية · أنظمة · بنية تحتية'
  }
};

const projectData = {
  store:{type:'FLAGSHIP PRODUCT',title:'M4I Store',summary:'A self-hosted FiveM commerce platform with an M4I-owned customer experience and Tebex/Cfx integrations.',role:'Founder · Product · Full-stack · Ops',status:'Live / evolving',stack:'FastAPI · Tebex Headless · Cfx · OAuth · Nginx',body:'<p>M4I Store is designed as a real product surface rather than a theme around a checkout link.</p><ul><li>M4I-owned storefront and CMS experience.</li><li>Tebex remains the payment and fulfilment authority.</li><li>Cfx identity, customer history, gift cards, docs and admin workflows are integrated into the product.</li><li>Production tooling covers migrations, preflight checks, Nginx and operational safety.</li></ul>',url:'https://store.m4i.ma/'},
  hosting:{type:'M4I PRODUCT',title:'M4I Hosting',summary:'The infrastructure face of the brand.',role:'Product · Infrastructure · UX',status:'Live',stack:'Hosting · Linux · Deployment · Operations',body:'<p>A dedicated product surface for infrastructure and hosting services under the same M4I identity. The production goal is a clear path from choosing a service to managing it.</p>',url:'https://hostingg.m4i.ma/'},
  roleplay:{type:'M4I / MKS',title:'MKS RolePlay',summary:'A complete digital layer around the roleplay community.',role:'Founder · Product · Full-stack',status:'Live',stack:'React · Node.js · Discord · Community Ops',body:'<p>The platform covers public presentation, applications, streamers, account flows and operational tooling around the MKS RolePlay experience.</p>',url:'https://app.m4i.ma/'},
  mks:{type:'M4I / COMMUNITY',title:'MKS Platform',summary:'Community operations and member experience.',role:'Owner · Product · Systems',status:'Live / evolving',stack:'Community · Members · Automation · Integrations',body:'<p>MKS is one of the recurring product lines inside M4I: member operations, support workflows, identity and internal tools designed around a live community.</p>',url:'https://mks.m4i.ma/'},
  dashboard:{type:'OPERATIONS',title:'M4I Dashboard',summary:'An operational surface for the systems behind the brand.',role:'Founder · Systems · Ops',status:'Live / internal-facing',stack:'Dashboards · Monitoring · Administration',body:'<p>The dashboard represents the control layer: operational state, administration and the interfaces needed to run products after they ship.</p>',url:'https://dashboard.m4i.ma/'},
  delta:{type:'CLIENT WORK',title:'Delta Ascenseur',summary:'A bilingual professional website for an elevator services business.',role:'Product design · Full-stack · Delivery',status:'Live',stack:'Web · FR/AR · Client portal · SEO',body:'<p>Designed around a clear business journey: elevator installation, preventive/corrective maintenance, modernization and 24/7 troubleshooting.</p><ul><li>French and Arabic communication.</li><li>Service-led navigation and quote journey.</li><li>Client-oriented trust and traceability messaging.</li></ul>',url:'https://delta-ascenseur.m4i.ma/'},
  nightmare:{type:'CLIENT / CUSTOM',title:'NIGHTMARE',summary:'A custom web project with its own identity, delivered through the M4I build process.',role:'Design · Build · Delivery',status:'Live',stack:'Web · Branding · Custom experience',body:'<p>NIGHTMARE is intentionally presented as client/custom work: a distinct visual world, built and delivered through the same M4I engineering workflow.</p>',url:'https://nightmare.m4i.ma/'},
  core:{type:'PRIVATE SYSTEM',title:'m4i_core',summary:'The server-authoritative core layer of the M4I FiveM architecture.',role:'Architecture · Backend · Performance',status:'Private development',stack:'Lua · Persistence · Framework-neutral',body:'<p>A framework-neutral core with explicit persistence and server authority. Gameplay resources integrate through m4i_bridge rather than coupling directly to the core.</p><ul><li>Small hot path and controlled persistence.</li><li>Integer-cent money accounting.</li><li>No direct dependency on QBCore, Qbox, ESX or Ox Core.</li></ul>'},
  bridge:{type:'PRIVATE SYSTEM',title:'m4i_bridge',summary:'The universal integration contract for M4I FiveM resources.',role:'Architecture · Integrations · Security',status:'Private / production platform',stack:'Lua · Providers · Callbacks · Observability',body:'<p>A stable API over framework, inventory, UI, notify, target, callbacks, database, logging and more.</p><ul><li>Provider adapters and health-aware fallback.</li><li>Structured logging and security helpers.</li><li>Plugin, hook and middleware extension runtime.</li></ul>'},
  identity:{type:'PRIVATE SYSTEM',title:'m4i_identity',summary:'Identity ownership and pre-join policy for the M4I ecosystem.',role:'Architecture · Identity · Security',status:'Private',stack:'Lua · Discord identity · Localization · Policy',body:'<p>Owns identity validation, policy decisions, language selection, reconnect protection and runtime identity state while keeping writes internal to the identity resource.</p>'}
};

function setTheme(theme){ root.dataset.theme = theme; localStorage.setItem('m4i-theme',theme); }
const savedTheme = localStorage.getItem('m4i-theme');
setTheme(savedTheme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light':'dark'));
themeToggle?.addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));

function applyLanguage(lang){
  root.lang = lang; root.dir = lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{ const v=translations[lang]?.[el.dataset.i18n]; if(v) el.textContent=v; });
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{ const v=translations[lang]?.[el.dataset.i18nHtml]; if(v) el.innerHTML=v; });
  languageLabel.textContent = lang==='ar'?'EN':'AR'; localStorage.setItem('m4i-lang',lang);
}
applyLanguage(localStorage.getItem('m4i-lang') || 'en');
languageToggle?.addEventListener('click',()=>applyLanguage(root.lang==='ar'?'en':'ar'));

menuButton?.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
navLinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');}));
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>12),{passive:true});
window.addEventListener('pointermove',e=>{const g=document.querySelector('.pointer-glow');if(g){g.style.left=`${e.clientX}px`;g.style.top=`${e.clientY}px`;}});

document.getElementById('year').textContent = new Date().getFullYear();
const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const filterButtons=[...document.querySelectorAll('#filters button')];
filterButtons.forEach(btn=>btn.addEventListener('click',()=>{
  filterButtons.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const filter=btn.dataset.filter;
  document.querySelectorAll('[data-project-category]').forEach(card=>card.classList.toggle('is-hidden',filter!=='all' && card.dataset.projectCategory!==filter));
}));

function openProject(key){
  const d=projectData[key]; if(!d) return;
  document.getElementById('modalType').textContent=d.type;
  document.getElementById('modalTitle').textContent=d.title;
  document.getElementById('modalSummary').textContent=d.summary;
  document.getElementById('modalRole').textContent=d.role;
  document.getElementById('modalStatus').textContent=d.status;
  document.getElementById('modalStack').textContent=d.stack;
  document.getElementById('modalBody').innerHTML=d.body;
  const actions=document.getElementById('modalActions'); actions.innerHTML='';
  if(d.url){const a=document.createElement('a');a.className='button primary small';a.href=d.url;a.target='_blank';a.rel='noreferrer';a.textContent='Open live project ↗';actions.appendChild(a);}
  modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('.open-project').forEach(btn=>btn.addEventListener('click',()=>openProject(btn.dataset.project)));
document.querySelectorAll('[data-close-modal]').forEach(el=>el.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});

function showToast(message){toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>toast.classList.remove('show'),2600);}
document.getElementById('discordButton')?.addEventListener('click',()=>showToast(root.lang==='ar'?'غادي نربط Discord الحقيقي قبل النسخة النهائية.':'The real Discord destination will be connected before production.'));

const STATUS_KEY='m4i-status-history-v1';
function loadHistory(){try{return JSON.parse(localStorage.getItem(STATUS_KEY)||'{}')}catch{return {}}}
function saveHistory(data){localStorage.setItem(STATUS_KEY,JSON.stringify(data));}
function renderBars(row,history){
  const box=row.querySelector('.uptime-bars'); box.innerHTML='';
  const padded=[...Array(Math.max(0,24-history.length)).fill(null),...history.slice(-24)];
  padded.forEach(v=>{const i=document.createElement('i');i.className=v===true?'good':v===false?'bad':'unknown';box.appendChild(i);});
}
function setState(row,state,ms){
  const box=row.querySelector('.service-state'); const text=box.querySelector('span'); const response=row.querySelector('.response-time');
  box.classList.remove('checking','operational','down'); box.classList.add(state);
  if(state==='operational'){text.textContent=root.lang==='ar'?'متاح':'Operational';response.textContent=`${Math.max(1,Math.round(ms))} ms`;}
  else if(state==='down'){text.textContent=root.lang==='ar'?'لا يستجيب':'No response';response.textContent='—';}
  else{text.textContent=root.lang==='ar'?'جارٍ الفحص':'Checking';response.textContent='—';}
}
async function probe(row){
  const url=row.dataset.url; const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),8000); const start=performance.now();
  try{await fetch(`${url}${url.includes('?')?'&':'?'}m4i_probe=${Date.now()}`,{method:'GET',mode:'no-cors',cache:'no-store',signal:controller.signal});clearTimeout(timeout);return {ok:true,ms:performance.now()-start};}
  catch{clearTimeout(timeout);return {ok:false,ms:null};}
}
async function runStatusCheck(){
  const button=document.getElementById('refreshStatus'); if(button) button.disabled=true;
  const rows=[...document.querySelectorAll('.service-row')]; rows.forEach(r=>setState(r,'checking'));
  const history=loadHistory(); let good=0;
  const results=await Promise.all(rows.map(async row=>({row,result:await probe(row)})));
  for(const {row,result} of results){const key=row.dataset.service;history[key]=Array.isArray(history[key])?history[key]:[];history[key].push(result.ok);history[key]=history[key].slice(-24);renderBars(row,history[key]);setState(row,result.ok?'operational':'down',result.ms);if(result.ok)good++;}
  saveHistory(history);
  const summaryText=document.getElementById('summaryText'); const summaryDot=document.getElementById('summaryDot');
  if(good===rows.length){summaryText.textContent=root.lang==='ar'?'كل الخدمات تستجيب':'All services reachable';summaryDot.style.background='var(--green)';}
  else if(good===0){summaryText.textContent=root.lang==='ar'?'لا توجد استجابة حالياً':'Services not reachable from this probe';summaryDot.style.background='var(--red)';}
  else{summaryText.textContent=root.lang==='ar'?`${good}/${rows.length} خدمات تستجيب`:`${good}/${rows.length} services reachable`;summaryDot.style.background='var(--gold)';}
  document.getElementById('lastChecked').textContent=`${root.lang==='ar'?'آخر فحص':'Last checked'} · ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
  if(button) button.disabled=false;
}
const initialHistory=loadHistory();document.querySelectorAll('.service-row').forEach(row=>renderBars(row,initialHistory[row.dataset.service]||[]));
document.getElementById('refreshStatus')?.addEventListener('click',runStatusCheck);
setTimeout(runStatusCheck,550);