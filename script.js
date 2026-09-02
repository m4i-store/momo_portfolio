const root = document.documentElement;
const header = document.querySelector('.site-header');
const themeToggle = document.getElementById('themeToggle');
const languageToggle = document.getElementById('languageToggle');
const languageLabel = document.getElementById('languageLabel');
const menuButton = document.getElementById('menuButton');
const navLinks = document.getElementById('navLinks');
const glow = document.querySelector('.cursor-glow');
const tiltCard = document.querySelector('.tilt-card');

const dictionary = {
  en: {
    'nav.about': 'About', 'nav.work': 'Work', 'nav.stack': 'Stack', 'nav.contact': 'Contact',
    'hero.available': 'Available for ambitious builds',
    'hero.line1': 'I build systems that', 'hero.line2': 'work in the real world.',
    'hero.lede': 'Full-stack developer focused on scalable community platforms, automation, integrations, FiveM products, and infrastructure.',
    'hero.ctaWork': 'Explore my work', 'hero.roleLabel': 'ROLE', 'hero.role': 'Full-stack Developer', 'hero.baseLabel': 'BASE', 'hero.base': 'Morocco · Remote', 'hero.focusLabel': 'FOCUS', 'hero.focus': 'Product + Systems',
    'card.tagline': 'Building reliable digital products from interface to infrastructure.',
    'terminal.one': 'ship --quality production', 'terminal.two': 'scale --without chaos', 'terminal.three': 'automate --repetitive work',
    'about.kicker': 'ABOUT', 'about.title': 'From idea to production.',
    'about.lead': 'I care about the whole system — product experience, backend logic, integrations, deployment, monitoring, and the boring edge cases that make software dependable.',
    'about.body': 'My work sits where web platforms, communities, game ecosystems, and automation meet. I like turning complicated workflows into clear interfaces and maintainable services.',
    'about.p1Title': 'Build for reality', 'about.p1Body': 'Design around actual users, permissions, failures, and operational constraints.',
    'about.p2Title': 'Automate the repeatable', 'about.p2Body': 'Remove repetitive work while keeping important decisions visible and auditable.',
    'about.p3Title': 'Ship with ownership', 'about.p3Body': 'Treat performance, security, deployment, and polish as part of the product.',
    'work.kicker': 'SELECTED WORK', 'work.title': 'Systems I’m building.',
    'work.mks': 'A community operations platform connecting member identity, licensing, permissions, provisioning, Discord OAuth, and admin workflows through a central core API.',
    'work.mks1': 'Role and scope based access control', 'work.mks2': 'Idempotent provisioning and license flows', 'work.mks3': 'Discord identity and guild integrations',
    'work.tracker': 'A Kick-focused tracking and highlighting tool for community operations, designed around fast account recognition, visual tagging, and scalable client-side performance.',
    'work.store': 'A premium FiveM product ecosystem combining polished storefront UX, licensing, server-side integrations, and custom resources for modern RP servers.',
    'work.nexus': 'A self-hosted Minecraft environment with infrastructure planning, mod compatibility, server operations, and custom gameplay automation.',
    'stack.kicker': 'TOOLKIT', 'stack.title': 'What I work with.', 'stack.webTitle': 'Web & Product', 'stack.apiTitle': 'Backend & Integrations', 'stack.opsTitle': 'Systems & Operations', 'stack.gameTitle': 'Game Ecosystems',
    'contact.kicker': 'LET’S BUILD', 'contact.title': 'Have something ambitious in mind?', 'contact.body': 'I’m interested in products where software has to solve a real operational problem — not just look good in a screenshot.', 'contact.cta': 'Connect on GitHub',
    'footer.copy': 'Built with care, shipped with Git.', 'footer.top': 'Back to top'
  },
  ar: {
    'nav.about': 'عني', 'nav.work': 'أعمالي', 'nav.stack': 'التقنيات', 'nav.contact': 'تواصل',
    'hero.available': 'متاح للمشاريع الطموحة',
    'hero.line1': 'أبني أنظمة', 'hero.line2': 'تنجح في الواقع.',
    'hero.lede': 'مطور Full-stack أركز على منصات المجتمعات القابلة للتوسع، الأتمتة، التكاملات، منتجات FiveM والبنية التحتية.',
    'hero.ctaWork': 'استكشف أعمالي', 'hero.roleLabel': 'الدور', 'hero.role': 'مطور Full-stack', 'hero.baseLabel': 'الموقع', 'hero.base': 'المغرب · عن بُعد', 'hero.focusLabel': 'التركيز', 'hero.focus': 'المنتج + الأنظمة',
    'card.tagline': 'أبني منتجات رقمية موثوقة من الواجهة إلى البنية التحتية.',
    'terminal.one': 'ship --quality production', 'terminal.two': 'scale --without chaos', 'terminal.three': 'automate --repetitive work',
    'about.kicker': 'نبذة', 'about.title': 'من الفكرة إلى الإنتاج.',
    'about.lead': 'أهتم بالنظام كاملاً — تجربة المنتج، منطق الخلفية، التكاملات، النشر، المراقبة وحتى الحالات الطرفية التي تجعل البرمجيات موثوقة.',
    'about.body': 'عملي يجمع بين منصات الويب والمجتمعات وأنظمة الألعاب والأتمتة. أحب تحويل سير العمل المعقد إلى واجهات واضحة وخدمات سهلة الصيانة.',
    'about.p1Title': 'ابنِ للواقع', 'about.p1Body': 'تصميم يأخذ المستخدمين الحقيقيين والصلاحيات والأعطال والقيود التشغيلية بعين الاعتبار.',
    'about.p2Title': 'أتمت ما يتكرر', 'about.p2Body': 'إلغاء العمل المتكرر مع إبقاء القرارات المهمة واضحة وقابلة للمراجعة.',
    'about.p3Title': 'سلّم بمسؤولية', 'about.p3Body': 'الأداء والأمان والنشر والصقل جزء من المنتج وليست إضافات لاحقة.',
    'work.kicker': 'أعمال مختارة', 'work.title': 'أنظمة أعمل على بنائها.',
    'work.mks': 'منصة لإدارة عمليات المجتمع تربط هوية الأعضاء والتراخيص والصلاحيات والتجهيز وDiscord OAuth وسير عمل الإدارة عبر Core API مركزي.',
    'work.mks1': 'تحكم بالصلاحيات مبني على الأدوار والنطاقات', 'work.mks2': 'تجهيز وربط تراخيص بطريقة آمنة وقابلة للتكرار', 'work.mks3': 'تكامل هوية Discord والسيرفرات',
    'work.tracker': 'أداة موجهة لـ Kick لتتبع وإبراز حسابات المجتمع، مع تعرف سريع على الحسابات وتصنيف بصري وأداء قابل للتوسع داخل المتصفح.',
    'work.store': 'منظومة منتجات FiveM مميزة تجمع بين متجر احترافي، التراخيص، تكاملات الخادم وموارد مخصصة لسيرفرات RP الحديثة.',
    'work.nexus': 'بيئة Minecraft مستضافة ذاتياً تشمل تخطيط البنية التحتية، توافق المودات، تشغيل الخادم وأتمتة مخصصة لأسلوب اللعب.',
    'stack.kicker': 'الأدوات', 'stack.title': 'التقنيات التي أعمل بها.', 'stack.webTitle': 'الويب والمنتج', 'stack.apiTitle': 'الخلفية والتكاملات', 'stack.opsTitle': 'الأنظمة والتشغيل', 'stack.gameTitle': 'أنظمة الألعاب',
    'contact.kicker': 'لنَبْنِ', 'contact.title': 'عندك فكرة طموحة؟', 'contact.body': 'تهمني المنتجات التي تحتاج البرمجيات فيها إلى حل مشكلة تشغيلية حقيقية، وليس فقط أن تبدو جميلة في لقطة شاشة.', 'contact.cta': 'تواصل عبر GitHub',
    'footer.copy': 'صُمم بعناية ونُشر عبر Git.', 'footer.top': 'العودة للأعلى'
  }
};

function applyLanguage(lang) {
  const next = dictionary[lang] ? lang : 'en';
  root.lang = next;
  root.dir = next === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[next][key]) node.textContent = dictionary[next][key];
  });
  languageLabel.textContent = next === 'en' ? 'AR' : 'EN';
  localStorage.setItem('portfolio-language', next);
}

function applyTheme(theme) {
  const next = theme === 'light' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('portfolio-theme', next);
}

const savedTheme = localStorage.getItem('portfolio-theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
applyTheme(savedTheme || preferredTheme);
applyLanguage(localStorage.getItem('portfolio-language') || 'en');

themeToggle.addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
languageToggle.addEventListener('click', () => applyLanguage(root.lang === 'en' ? 'ar' : 'en'));

menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuButton.classList.toggle('active', open);
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
}));

window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 16), { passive: true });
document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));

if (window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });

  tiltCard.addEventListener('pointermove', (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${y * -7}deg)`;
  });
  tiltCard.addEventListener('pointerleave', () => { tiltCard.style.transform = ''; });
}
