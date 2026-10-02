/* HRS CAR — interactions */
'use strict';
const CONFIG={brand:'ZIRRARI CAR',whatsapp:'212661614048'};
const CARS=[
 {id:'clio',slug:'renault-clio',name:'Renault Clio',type:'Citadine',price:400,seats:5,gearbox:'Manuelle',ac:true,image:'images/clio.jpg'},
 {id:'logan',slug:'dacia-logan',name:'Dacia Logan',type:'Berline',price:350,seats:5,gearbox:'Manuelle',ac:true,image:'images/images/Dacia_Logan.png'},
 {id:'sandero',slug:'dacia-sandero',name:'Dacia Sandero',type:'Citadine',price:350,seats:5,gearbox:'Manuelle',ac:true,image:'images/sandero.webp'},
 {id:'peugeot-208',slug:'peugeot-208',name:'Peugeot 208',type:'Citadine',price:350,seats:5,gearbox:'Manuelle-auto',ac:true,image:'images/peugeot-208.webp?v=2'}
];
const $=(s,c=document)=>c.querySelector(s);
const waLink=text=>`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const plural=(n,w)=>`${n} ${w}${n>1?'s':''}`;
const todayISO=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
const formatDate=iso=>new Date(iso+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long'});
const state={type:'all',start:'',end:''};
function rentalDays(){if(!state.start||!state.end)return 0;const diff=Math.round((new Date(state.end)-new Date(state.start))/864e5);return diff>0?diff:1}
function reservationMessage(car){let msg=`Bonjour ${CONFIG.brand}, je souhaite réserver la ${car.name} (${car.price} DH/jour).`;const days=rentalDays();if(days)msg+=` Du ${formatDate(state.start)} au ${formatDate(state.end)} (${plural(days,'jour')}), total estimé : ${car.price*days} DH.`;return msg+' Est-elle disponible ?'}
function carCard(car){const days=rentalDays();const detail=`vehicule.html?id=${car.slug||car.id}`;return `<article class="car-card"><a class="car-media" href="${detail}" aria-label="Voir ${car.name}"><img src="${car.image}" alt="${car.name}" loading="lazy" width="640" height="400" onerror="this.style.display='none'"><span class="badge">${car.type}</span></a><div class="car-body"><h3>${car.name}</h3><ul class="specs"><li>👤 ${car.seats} places</li><li>⚙ ${car.gearbox}</li><li>❄ Climatisation</li></ul><div class="car-foot"><div><p class="price"><strong>${car.price} DH</strong> <span>/ jour</span></p>${days?`<p class="total">Total estimé : ${car.price*days} DH</p>`:''}</div><a class="btn btn-dark" href="${detail}">Voir le véhicule</a></div></div></article>`}
function render(){const grid=$('#car-grid');if(!grid)return;const list=CARS.filter(c=>state.type==='all'||c.type===state.type);grid.innerHTML=list.map(carCard).join('');const results=$('#results');if(!results)return;let txt=plural(list.length,'voiture')+' affichée'+(list.length>1?'s':'');const days=rentalDays();if(days)txt+=` pour ${plural(days,'jour')}`;results.innerHTML=(state.type!=='all'||days)?`${txt}. <button type="button" id="reset">Tout afficher</button>`:''}
const searchForm=$('#search-form'),startInput=$('#start'),endInput=$('#end'),typeSelect=$('#type');
if(startInput&&endInput){startInput.min=endInput.min=todayISO();startInput.addEventListener('change',()=>{endInput.min=startInput.value||todayISO();if(endInput.value&&endInput.value<startInput.value)endInput.value=startInput.value})}
searchForm?.addEventListener('submit',e=>{e.preventDefault();state.type=typeSelect?.value||'all';state.start=startInput?.value||'';state.end=endInput?.value||'';render();$('#voitures')?.scrollIntoView({behavior:'smooth',block:'start'})});
$('#results')?.addEventListener('click',e=>{if(e.target.id==='reset'){Object.assign(state,{type:'all',start:'',end:''});searchForm?.reset();render()}});
const carSelect=$('#c-car');if(carSelect)carSelect.innerHTML='<option value="">Je ne sais pas encore</option>'+CARS.map(c=>`<option value="${c.name}">${c.name} (${c.price} DH/jour)</option>`).join('');
$('#contact-form')?.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target);const parts=[`Bonjour ${CONFIG.brand}, je m'appelle ${String(f.get('name')||'').trim()}.`,`Mon téléphone : ${String(f.get('phone')||'').trim()}.`];if(f.get('car'))parts.push(`Voiture souhaitée : ${f.get('car')}.`);if(String(f.get('message')||'').trim())parts.push(String(f.get('message')).trim());window.open(waLink(parts.join(' ')),'_blank')});
document.querySelectorAll('[data-wa]').forEach(a=>{a.href=waLink(a.dataset.wa)});
const nav=$('#nav'),burger=$('#burger');function setMenu(open){if(!nav||!burger)return;nav.classList.toggle('open',open);burger.setAttribute('aria-expanded',String(open));burger.setAttribute('aria-label',open?'Fermer le menu':'Ouvrir le menu')}burger?.addEventListener('click',()=>setMenu(!nav?.classList.contains('open')));nav?.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
const revealItems=document.querySelectorAll('.reveal');if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');io.unobserve(entry.target)}}),{threshold:.12});revealItems.forEach(el=>io.observe(el))}else revealItems.forEach(el=>el.classList.add('visible'));
const year=$('#year');if(year)year.textContent=new Date().getFullYear();
render();
/* Mobile testimonials autoplay */
(function(){
  const slider=document.querySelector('.review-grid');
  if(!slider || window.matchMedia('(max-width: 700px)').matches===false) return;
  const cards=[...slider.querySelectorAll('.review-card')];
  if(cards.length<2) return;
  let index=0, timer;
  const move=()=>{index=(index+1)%cards.length;slider.scrollTo({left:cards[index].offsetLeft-slider.offsetLeft,behavior:'smooth'});};
  const start=()=>{clearInterval(timer);timer=setInterval(move,5000)};
  const stop=()=>clearInterval(timer);
  slider.addEventListener('mouseenter',stop);slider.addEventListener('mouseleave',start);
  slider.addEventListener('touchstart',stop,{passive:true});slider.addEventListener('touchend',start,{passive:true});
  start();
})();

function showVehicleDetail(){
  if(!location.search.includes('vehicle=')) return;
  const id=new URLSearchParams(location.search).get('vehicle')||'dacia-logan';
  const cars={
    'dacia-logan':{name:'Dacia Logan',type:'Berline',price:350,image:'images/The new Dacia Logan from 8,400 euros.jfif',gear:'Manuelle',desc:'Une berline pratique et confortable, adaptée aux déplacements quotidiens, aux trajets en famille et aux road trips au Maroc.'},
    'renault-clio':{name:'Renault Clio',type:'Citadine',price:400,image:'images/clio.jpg',gear:'Manuelle',desc:'Une citadine polyvalente et agréable pour circuler en ville ou partir quelques jours à la découverte de la région.'},
    'dacia-sandero':{name:'Dacia Sandero',type:'Citadine',price:350,image:'images/sandero.webp',gear:'Manuelle',desc:'Un modèle pratique et économique pour les trajets quotidiens, les escapades et les déplacements en famille.'},
    'peugeot-208':{name:'Peugeot 208',type:'Citadine',price:350,image:'images/peugeot-208.webp',gear:'Manuelle-auto',desc:'Une citadine moderne et confortable, idéale pour les déplacements en ville et les trajets sur route.'}
  };
  const car=cars[id]||cars['dacia-logan'];
  const main=document.querySelector('main');
  if(!main) return;
  document.title='ZIRRARI CAR | '+car.name;
  document.querySelectorAll('.nav a').forEach(a=>a.classList.remove('active'));
  main.innerHTML=`
  <section class="vehicle-hero"><div class="container vehicle-hero-grid">
    <div class="vehicle-photo"><div class="vehicle-photo-inner"><img src="${car.image}" alt="${car.name}"></div><span class="badge">${car.type}</span></div>
    <div class="vehicle-summary"><span class="eyebrow">ZIRRARI CAR · LOCATION</span><h1>${car.name}</h1>
      <div class="vehicle-rate">Dès <strong>${car.price} DH</strong><span>/ jour</span></div>
      <ul class="vehicle-spec-list"><li>👤 <strong>5 places</strong></li><li>⚙ <strong>${car.gear}</strong></li><li>🚪 <strong>4/5 portes</strong></li><li>❄ <strong>Climatisation</strong></li></ul>
      <p>${car.desc}</p><a class="btn btn-primary" target="_blank" rel="noopener" href="https://wa.me/212661614048?text=${encodeURIComponent('Bonjour ZIRRARI CAR, je souhaite réserver la '+car.name+'. Est-elle disponible ?')}">Demander ce véhicule sur WhatsApp →</a>
    </div></div></section>
  <section class="section estimate-section"><div class="container"><div class="section-head center"><span class="eyebrow">ESTIMEZ VOTRE TARIF</span><h2>Calculez votre <em>budget.</em></h2><p>Tarif indicatif selon le nombre de jours.</p></div>
    <div class="estimate-card"><div class="duration-buttons"><button data-days="1">1 jour</button><button data-days="3">3 jours</button><button data-days="7" class="active">7 jours</button><button data-days="14">14 jours</button><button data-days="30">30 jours</button></div>
      <div class="estimate-row"><div><label>Nombre de jours</label><input id="vd-days" type="number" min="1" max="365" value="7"></div><div><span>Tarif journalier</span><strong>${car.price} DH / jour</strong></div><div><span>Total estimé</span><strong id="vd-total">${car.price*7} DH</strong></div></div>
      <a id="vd-wa" class="btn btn-dark" target="_blank" rel="noopener">Confirmer sur WhatsApp →</a></div></div></section>
  <section class="section section-soft"><div class="container"><div class="section-head"><span class="eyebrow">CE QUI EST INCLUS</span><h2>Dans votre location</h2></div><div class="ideal-grid"><article><span>01</span><h3>Véhicule préparé</h3><p>Voiture préparée avant la remise des clés.</p></article><article><span>02</span><h3>Climatisation</h3><p>Confort pour vos trajets au quotidien.</p></article><article><span>03</span><h3>Contact direct</h3><p>Une équipe joignable par téléphone et WhatsApp.</p></article></div></div></section>
  <section class="section section-dark faq-section"><div class="container narrow"><div class="section-head center"><span class="eyebrow">QUESTIONS FRÉQUENTES</span><h2>Avant de <em>réserver.</em></h2></div><div class="faq-list">
    <details open><summary>Comment réserver ?</summary><p>Envoyez vos dates et le véhicule souhaité sur WhatsApp. Nous confirmons ensuite la disponibilité et les conditions.</p></details>
    <details><summary>La voiture est-elle disponible à mes dates ?</summary><p>La disponibilité doit être confirmée avec l'équipe ZIRRARI CAR pour vos dates exactes.</p></details>
    <details><summary>Peut-on demander une livraison ?</summary><p>Une remise du véhicule peut être organisée selon disponibilité et l'adresse convenue.</p></details>
  </div></div></section>
  <section class="section"><div class="container"><div class="section-head center"><span class="eyebrow">BESOIN D'UNE AUTRE VOITURE ?</span><h2>Retour à <em>la flotte.</em></h2><p>Découvrez les autres modèles disponibles.</p><a class="btn btn-primary" href="voitures.html">Voir toutes les voitures →</a></div></div></section>`;
  const money=n=>n.toLocaleString('fr-FR')+' DH';
  const daysInput=document.querySelector('#vd-days'),total=document.querySelector('#vd-total'),wa=document.querySelector('#vd-wa');
  function sync(n){n=Math.max(1,Math.min(365,Number(n)||1));daysInput.value=n;total.textContent=money(car.price*n);wa.href='https://wa.me/212661614048?text='+encodeURIComponent('Bonjour ZIRRARI CAR, je souhaite réserver la '+car.name+' pour '+n+' jour'+(n>1?'s':'')+', total estimé : '+car.price*n+' DH. Est-elle disponible ?')}
  document.querySelectorAll('[data-days]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-days]').forEach(x=>x.classList.remove('active'));b.classList.add('active');sync(b.dataset.days)}));
  daysInput.addEventListener('input',()=>{document.querySelectorAll('[data-days]').forEach(x=>x.classList.toggle('active',Number(x.dataset.days)===Number(daysInput.value)));sync(daysInput.value)});
  sync(7);
}

showVehicleDetail();
