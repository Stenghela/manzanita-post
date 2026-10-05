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
// Aggiornamento in tempo reale: la pagina si ridisegna appena qualcuno cambia i dati
function avvia(carica, sheet) {
  db.collection(sheet).onSnapshot(
    s => { cache[sheet] = leggi(s); carica(); },
    e => { const el = document.querySelector('#err'); if (el) el.textContent = 'Errore: ' + (e.code === 'permission-denied' ? 'permessi Firestore mancanti (vedi le regole)' : e.message); }
  );
}
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav = p => `<nav><a href="index.html">Registro</a><a href="ordini.html"${p==='o'?' class="on"':''}>Ordini fattura</a><a href="eventi.html"${p==='e'?' class="on"':''}>Eventi gara</a><a href="regole.html"${p==='r'?' class="on"':''}>Regole</a></nav>`;
