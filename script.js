/* HRS CAR — interactions */
'use strict';
const CONFIG={brand:'ZIRRARI CAR',whatsapp:'212661614048'};
const CARS=[
 {id:'clio',name:'Renault Clio',type:'Citadine',price:400,seats:5,gearbox:'Manuelle',ac:true,image:'images/clio.jpg'},
 {id:'logan',name:'Dacia Logan',type:'Berline',price:350,seats:5,gearbox:'Manuelle',ac:true,image:'images/images/Dacia_Logan.png'},
 {id:'sandero',name:'Dacia Sandero',type:'Citadine',price:350,seats:5,gearbox:'Manuelle',ac:true,image:'images/sandero.webp'},
 {id:'peugeot-208',name:'Peugeot 208',type:'Citadine',price:350,seats:5,gearbox:'Manuelle-auto',ac:true,image:'images/peugeot-208.webp?v=2'}
];
const $=(s,c=document)=>c.querySelector(s);
const waLink=text=>`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const plural=(n,w)=>`${n} ${w}${n>1?'s':''}`;
const todayISO=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
const formatDate=iso=>new Date(iso+'T00:00:00').toLocaleDateString('fr-FR',{day:'numeric',month:'long'});
const state={type:'all',start:'',end:''};
function rentalDays(){if(!state.start||!state.end)return 0;const diff=Math.round((new Date(state.end)-new Date(state.start))/864e5);return diff>0?diff:1}
function reservationMessage(car){let msg=`Bonjour ${CONFIG.brand}, je souhaite réserver la ${car.name} (${car.price} DH/jour).`;const days=rentalDays();if(days)msg+=` Du ${formatDate(state.start)} au ${formatDate(state.end)} (${plural(days,'jour')}), total estimé : ${car.price*days} DH.`;return msg+' Est-elle disponible ?'}
function carCard(car){const days=rentalDays();return `<article class="car-card"><div class="car-media"><img src="${car.image}" alt="${car.name}" loading="lazy" width="640" height="400" onerror="this.style.display='none'"><span class="badge">${car.type}</span></div><div class="car-body"><h3>${car.name}</h3><ul class="specs"><li>👤 ${car.seats} places</li><li>⚙ ${car.gearbox}</li><li>❄ Climatisation</li></ul><div class="car-foot"><div><p class="price"><strong>${car.price} DH</strong> <span>/ jour</span></p>${days?`<p class="total">Total estimé : ${car.price*days} DH</p>`:''}</div><a class="btn btn-dark" href="${waLink(reservationMessage(car))}" target="_blank" rel="noopener">Réserver</a></div></div></article>`}
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
