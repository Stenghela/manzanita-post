// Incolla qui la configurazione di Firebase (Impostazioni progetto > Le tue app > Configurazione SDK)
const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBxyhfYFy6w-Fv5USAWXB7BGb9gwjflvvc',
  authDomain: 'manzanita-post.firebaseapp.com',
  projectId: 'manzanita-post',
  storageBucket: 'manzanita-post.firebasestorage.app',
  messagingSenderId: '661265400480',
  appId: '1:661265400480:web:ec9127ac34c9472bcfbfc5'
};
let db = null;
if (typeof firebase !== 'undefined') { firebase.initializeApp(FIREBASE_CONFIG); db = firebase.firestore(); }
const cache = {};
const leggi = s => s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.creato || 0) - (b.creato || 0));
async function api(action, sheet, extra = {}) {
  const col = db.collection(sheet);
  if (action === 'list') {
    if (!cache[sheet]) cache[sheet] = leggi(await col.get());
    return { rows: cache[sheet] };
  }
  if (action === 'add') await col.add({ data: new Date().toISOString().slice(0, 10), ...extra.row, creato: Date.now() });
  if (action === 'update') await col.doc(extra.id).update(extra.row);
  if (action === 'delete') await col.doc(extra.id).delete();
  return { ok: 1 };
}
function avvia(carica, sheet) {
  db.collection(sheet).onSnapshot(
    s => { cache[sheet] = leggi(s); carica(); if (sheet === 'Ordini') aggiornaBadgeOrdini(); },
    e => { const el = document.querySelector('#err'); if (el) el.textContent = 'Errore: ' + (e.code === 'permission-denied' ? 'permessi Firestore mancanti (vedi le regole)' : e.message); }
  );
}
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function nav(p) {
  setTimeout(initChrome, 0);
  const items = [
    ['index.html','Registro','i','📒'],
    ['ordini.html','Ordini','o','📦'],
    ['eventi.html','Eventi','e','🏆'],
    ['regole.html','Regole','r','📜']
  ];
  return `
    <div class="nav-shell">
      <nav>${items.map(([href,label,key,ico]) => `<a href="${href}"${p===key?' class="on"':''}><span class="ico">${ico}</span>${label}</a>`).join('')}</nav>
      <a class="order-alert" href="ordini.html" aria-label="Ordini da gestire">
        <span class="bell">🔔</span>
        <span class="badge" hidden>0</span>
      </a>
      <a class="mp-logo" href="index.html" aria-label="Manzanita Post">
        <img src="theme-assets/manzanita-logo.png" alt="Logo Manzanita Post con orso grizzly">
      </a>
    </div>`;
}
let ordineListenerAttivo = false;
function initChrome(){ aggiornaBadgeOrdini(); }
function aggiornaBadgeOrdini(){
  const alert = document.querySelector('.order-alert');
  const badge = alert?.querySelector('.badge');
  if (!alert || !badge || !db) return;
  if (!ordineListenerAttivo) {
    ordineListenerAttivo = true;
    db.collection('Ordini').onSnapshot(s => {
      const aperti = s.docs.map(d => d.data()).filter(r => (r.stato || 'Da fare') !== 'Consegnato').length;
      badge.textContent = String(aperti);
      badge.hidden = aperti <= 0;
      alert.classList.toggle('has-orders', aperti > 0);
      alert.style.display = aperti > 0 ? 'inline-flex' : 'none';
    }, () => {});
  }
}
