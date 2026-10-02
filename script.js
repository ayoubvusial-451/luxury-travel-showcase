/* ==========================================================
   HRS CAR | script.js
   - Modifiez CONFIG et CARS ci-dessous pour mettre à jour le site
   ========================================================== */
'use strict';

const CONFIG = {
  brand: 'HRS CAR',
  whatsapp: '212661614048' // format international, sans + ni espaces
};

/* Pour afficher une vraie photo : mettez le chemin dans "image",
   par ex. image: 'images/clio.jpg'. Sans image, une silhouette est affichée. */
const CARS = [
  { id: 'clio',    name: 'Renault Clio',  type: 'Manuelle', price: 400, seats: 5, gearbox: 'Manuelle', ac: true, color: '#ecece6', image: 'images/clio.jpg' },
  { id: 'logan',   name: 'Dacia Logan',   type: 'Manuelle',  price: 350, seats: 5, gearbox: 'Manuelle', ac: true, color: '#8f99a3', image: 'images/images/Dacia_Logan.png' },
  { id: 'sandero', name: 'Dacia Sandero', type: 'Manuelle', price: 350, seats: 5, gearbox: 'Manuelle', ac: true, color: '#3d7be0', image: 'images/sandero.webp' },
   { id: 'PEUGEOT 208', name: 'PEUGEOT 208', type: 'Manuelle-auto', price: 350, seats: 5, gearbox: 'Manuelle-auto', ac: true, color: '#3d7be0', image: 'images/peugeot-208.web' }
];
/* ---------- Utilitaires ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const icon = name => `<svg class="ic" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const waLink = text => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const plural = (n, word) => `${n} ${word}${n > 1 ? 's' : ''}`;

const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};
const formatDate = iso =>
  new Date(iso + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

/* ---------- État de la recherche ---------- */
const state = { type: 'all', start: '', end: '' };

function rentalDays() {
  if (!state.start || !state.end) return 0;
  const diff = Math.round((new Date(state.end) - new Date(state.start)) / 864e5);
  return Math.max(1, diff);
}

function reservationMessage(car) {
  let msg = `Bonjour ${CONFIG.brand}, je souhaite réserver la ${car.name} (${car.price} DH/jour).`;
  const days = rentalDays();
  if (days) {
    msg += ` Du ${formatDate(state.start)} au ${formatDate(state.end)} (${plural(days, 'jour')}), total estimé : ${car.price * days} DH.`;
  }
  return msg + ' Est-elle disponible ?';
}

/* ---------- Rendu des voitures ---------- */
const grid = $('#car-grid');
const results = $('#results');

function carCard(car) {
  const days = rentalDays();
  const media = car.image
    ? `<img src="${car.image}" alt="${car.name}" loading="lazy" width="640" height="400">`
    : `<svg class="car-art" viewBox="0 0 320 130" style="color:${car.color}" role="img" aria-label="${car.name}"><use href="#car-shape"/></svg>`;

  return `
    <article class="car-card">
      <div class="car-media">
        ${media}
        <span class="badge">${car.type}</span>
      </div>
      <div class="car-body">
        <h3>${car.name}</h3>
        <ul class="specs">
          <li>${icon('user')} ${car.seats} places</li>
          <li>${icon('gear')} ${car.gearbox}</li>
          ${car.ac ? `<li>${icon('snow')} Climatisation</li>` : ''}
        </ul>
        <div class="car-foot">
          <div>
            <p class="price"><strong>${car.price} DH</strong> <span>/ jour</span></p>
            ${days ? `<p class="total">Total estimé : ${car.price * days} DH pour ${plural(days, 'jour')}</p>` : ''}
          </div>
          <a class="btn btn-dark" href="${waLink(reservationMessage(car))}" target="_blank" rel="noopener"
             aria-label="Réserver la ${car.name} sur WhatsApp">Réserver</a>
        </div>
      </div>
    </article>`;
}

function render() {
  const list = CARS.filter(c => state.type === 'all' || c.type === state.type);
  const days = rentalDays();
  const filtered = state.type !== 'all' || days > 0;

  grid.innerHTML = list.length
    ? list.map(carCard).join('')
    : '<p class="empty">Aucune voiture de ce type pour le moment. Appelez-nous au 06 61 61 40 48.</p>';

  let text = plural(list.length, 'voiture') + ' affichée' + (list.length > 1 ? 's' : '');
  if (days) text += ` pour ${plural(days, 'jour')}, du ${formatDate(state.start)} au ${formatDate(state.end)}`;
  results.innerHTML = filtered ? `${text}. <button type="button" id="reset">Tout afficher</button>` : '';
}

/* ---------- Formulaire de recherche ---------- */
const searchForm = $('#search-form');
const startInput = $('#start');
const endInput = $('#end');
const typeSelect = $('#type');

startInput.min = endInput.min = todayISO();

startInput.addEventListener('change', () => {
  endInput.min = startInput.value || todayISO();
  if (endInput.value && endInput.value < startInput.value) endInput.value = startInput.value;
});

searchForm.addEventListener('submit', e => {
  e.preventDefault();
  state.type = typeSelect.value;
  state.start = startInput.value;
  state.end = endInput.value;
  render();
  $('#voitures').scrollIntoView({ behavior: 'smooth' });
});

results.addEventListener('click', e => {
  if (e.target.id !== 'reset') return;
  Object.assign(state, { type: 'all', start: '', end: '' });
  searchForm.reset();
  render();
});

/* ---------- Liens WhatsApp génériques ---------- */
document.querySelectorAll('[data-wa]').forEach(a => {
  a.href = waLink(a.dataset.wa);
});

/* ---------- Formulaire de contact ---------- */
const carSelect = $('#c-car');
carSelect.innerHTML =
  '<option value="">Je ne sais pas encore</option>' +
  CARS.map(c => `<option value="${c.name}">${c.name} (${c.price} DH/jour)</option>`).join('');

$('#contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const parts = [
    `Bonjour ${CONFIG.brand}, je m'appelle ${f.get('name').trim()}.`,
    `Mon téléphone : ${f.get('phone').trim()}.`
  ];
  if (f.get('car')) parts.push(`Voiture souhaitée : ${f.get('car')}.`);
  if (f.get('message').trim()) parts.push(f.get('message').trim());
  window.open(waLink(parts.join(' ')), '_blank', 'noopener');
});

/* ---------- Menu mobile ---------- */
const nav = $('#nav');
const burger = $('#burger');

function setMenu(open) {
  nav.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

/* ---------- Init ---------- */
$('#year').textContent = new Date().getFullYear();
render();
/* =========================================
   Header Carousel Script (Agence Locale)
   ========================================= */

const headerItems = document.querySelectorAll('.header-carousel-item');
let currentHeaderIndex = 0;

function showNextHeaderItem() {
  headerItems[currentHeaderIndex].classList.remove('active');
  currentHeaderIndex = (currentHeaderIndex + 1) % headerItems.length;
  headerItems[currentHeaderIndex].classList.add('active');
}

setInterval(showNextHeaderItem, 5000); // يدوز أوتوماتيكياً كل 5 ثواني
