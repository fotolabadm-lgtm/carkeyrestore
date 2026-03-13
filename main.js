/**
 * CarKey reStore — главный скрипт
 * Загрузка данных из JSON, рендеринг, бургер-меню, анимации
 */

const DEFAULTS = {
  hero: {
    title: 'Восстановим доступ к любому автомобилю',
    subtitle: 'Ремонт автоэлектрики, изготовление ключей, перепрошивка блоков управления',
    button_text: 'Заказать звонок'
  },
  company: {
    phone: '+7 (999) 123-45-67',
    address: 'г. Москва, ул. Автомобильная, д. 10',
    hours: '9:00–21:00',
    email: 'info@carkeyrestore.ru',
    social: [
      { name: 'Telegram', url: 'https://t.me/carkeyrestore', icon: 'fa-brands fa-telegram' },
      { name: 'Instagram', url: 'https://instagram.com/carkeyrestore', icon: 'fa-brands fa-instagram' },
      { name: 'ВКонтакте', url: 'https://vk.com/carkeyrestore', icon: 'fa-brands fa-vk' }
    ]
  },
  services: [
    { name: 'Изготовление ключей', price: 'от 1500 ₽', description: 'лазер, dimple', icon: 'fa-solid fa-key' },
    { name: 'Программирование чип-ключей', price: 'от 2000 ₽', description: 'полная утеря', icon: 'fa-solid fa-microchip' },
    { name: 'Вскрытие авто без повреждений', price: 'от 2500 ₽', description: '', icon: 'fa-solid fa-car-side' },
    { name: 'Ремонт блоков управления (ЭБУ)', price: 'индивидуально', description: '', icon: 'fa-solid fa-brain' },
    { name: 'Диагностика автоэлектрики', price: 'от 1000 ₽', description: '', icon: 'fa-solid fa-plug' },
    { name: 'Привязка б/у блоков', price: 'договорная', description: '', icon: 'fa-solid fa-rotate' }
  ],
  equipment: [
    { name: 'Xhorse Condor', model: 'XC-002 Pro', description: 'Прецизионная резка ключей', image: '' },
    { name: 'Xhorse Dolphin', model: 'II XP-005L', description: 'Лазерная резка', image: '' },
    { name: 'Xhorse Key Tool', model: 'Max Pro', description: 'Программирование иммобилайзеров', image: '' },
    { name: 'Multiprog', model: '', description: 'Ремонт блоков ECU', image: '' },
    { name: 'Autel', model: 'IM608 Pro2', description: 'Профессиональная диагностика', image: '' }
  ]
};

/**
 * Загрузка JSON с fallback на дефолтное значение
 * @param {string} url - путь к файлу
 * @param {*} defaultValue - значение при ошибке
 * @returns {Promise<*>}
 */
async function loadJSON(url, defaultValue) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    return await res.json();
  } catch (e) {
    console.warn(`loadJSON(${url}): используем дефолт`, e);
    return defaultValue;
  }
}

/**
 * Рендер Hero-секции
 */
function renderHero(data) {
  const hero = data || DEFAULTS.hero;
  const el = document.getElementById('hero-content');
  if (!el) return;

  el.querySelector('.hero-title').textContent = hero.title;
  el.querySelector('.hero-subtitle').textContent = hero.subtitle;
  const btn = el.querySelector('.hero-btn-primary');
  if (btn) btn.textContent = hero.button_text;
}

/**
 * Рендер услуг
 */
function renderServices(data) {
  const list = (data && data.services) ? data.services : DEFAULTS.services;
  const container = document.getElementById('services-grid');
  if (!container) return;

  container.innerHTML = list.map(s => `
    <div class="service-card">
      <i class="${s.icon || 'fa-solid fa-key'}"></i>
      <div>
        <strong>${escapeHtml(s.name)}</strong>
        ${s.description ? `<p style="font-size:0.9rem;color:var(--text-secondary)">${escapeHtml(s.description)}</p>` : ''}
        <span class="price">${escapeHtml(s.price)}</span>
      </div>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Рендер оборудования (с плейсхолдером фото)
 */
function renderEquipment(data) {
  const list = (data && data.equipment) ? data.equipment : DEFAULTS.equipment;
  const container = document.getElementById('equipment-grid');
  if (!container) return;

  container.innerHTML = list.map(e => {
    const fullName = e.model ? `${e.name} ${e.model}`.trim() : e.name;
    const imgSrc = e.image ? (e.image.startsWith('/') ? e.image : '/' + e.image) : '';
    const imgHtml = imgSrc
      ? `<img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(fullName)}">`
      : '<span>Фото оборудования появится здесь</span>';
    return `
      <div class="equipment-card">
        <div class="equipment-image">${imgHtml}</div>
        <div class="equipment-body">
          <div class="name">${escapeHtml(fullName)}</div>
          ${e.description ? `<div class="description">${escapeHtml(e.description)}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Рендер контактов и соцсетей
 */
function renderCompany(data) {
  const c = data || DEFAULTS.company;
  const container = document.getElementById('contacts-content');
  if (!container) return;

  const phoneDigits = (c.phone || '').replace(/\D/g, '');
  const phoneHref = phoneDigits ? `tel:+${phoneDigits}` : '#';

  container.innerHTML = `
    <div>
      <div class="contact-item">
        <i class="fa-solid fa-phone"></i>
        <a href="${phoneHref}">${escapeHtml(c.phone || '')}</a>
        <span style="color:var(--text-secondary)"> — ${escapeHtml(c.hours || '')}</span>
      </div>
      <div class="contact-item">
        <i class="fa-solid fa-location-dot"></i>
        <a href="#" target="_blank">${escapeHtml(c.address || '')}</a>
      </div>
      <div class="contact-item">
        <i class="fa-solid fa-envelope"></i>
        <a href="mailto:${escapeHtml(c.email || '')}">${escapeHtml(c.email || '')}</a>
      </div>
    </div>
    <div>
      <p style="margin-bottom:1rem;color:var(--text-secondary)">Соцсети</p>
      <div class="social-links">
        ${(c.social || []).map(s => `
          <a href="${escapeHtml(s.url)}" target="_blank" rel="noopener" title="${escapeHtml(s.name)}">
            <i class="${s.icon || 'fa-brands fa-link'}"></i>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}

/**
 * Инициализация: загрузка данных и рендеринг
 */
async function init() {
  const [heroData, companyData, servicesData, equipmentData] = await Promise.all([
    loadJSON('data/hero.json', DEFAULTS.hero),
    loadJSON('data/company.json', DEFAULTS.company),
    loadJSON('data/services.json', { services: DEFAULTS.services }),
    loadJSON('data/equipment.json', { equipment: DEFAULTS.equipment })
  ]);

  renderHero(heroData);
  renderCompany(companyData);
  renderServices(servicesData);
  renderEquipment(equipmentData);

  initBurger();
  initScrollAnimations();
}

/**
 * Бургер-меню для мобильной версии
 */
function initBurger() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Анимация появления секций при скролле
 */
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  document.querySelector('.hero-content')?.classList.add('visible');
}

// Запуск после загрузки DOM
document.addEventListener('DOMContentLoaded', init);
