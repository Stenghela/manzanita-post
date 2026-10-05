const API_URL = 'INCOLLA_QUI_URL_APPS_SCRIPT';
async function api(action, sheet, extra = {}) {
  const r = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action, sheet, ...extra }) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j;
}
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav = p => `<nav><a href="index.html">Registro</a><a href="ordini.html"${p==='o'?' class="on"':''}>Ordini fattura</a><a href="eventi.html"${p==='e'?' class="on"':''}>Eventi gara</a></nav>`;
function avvia(carica) { carica(); setInterval(carica, 15000); }
