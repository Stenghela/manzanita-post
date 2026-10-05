const API_URL = 'https://script.google.com/macros/s/AKfycbyijCFAIQXVqgTXhXGLpLCqGg_nzfWsQnRz3s5YpKr0wC87QTg7Di77rUty4VWIMfOLQA/exec';
async function api(action, sheet, extra = {}) {
  const r = await fetch(API_URL, { method: 'POST', body: JSON.stringify({ action, sheet, ...extra }) });
  const t = await r.text();
  let j;
  try { j = JSON.parse(t); }
  catch (e) { throw new Error('risposta non valida (' + r.status + ') da ' + r.url.slice(0, 60) + ' → ' + t.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220)); }
  if (j.error) throw new Error(j.error);
  return j;
}
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nav = p => `<nav><a href="index.html">Registro</a><a href="ordini.html"${p==='o'?' class="on"':''}>Ordini fattura</a><a href="eventi.html"${p==='e'?' class="on"':''}>Eventi gara</a></nav>`;
function avvia(carica) { carica(); setInterval(carica, 15000); }
