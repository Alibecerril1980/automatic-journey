const seedQuotes = [
  { id: 'seed-1', text: 'La disciplina convierte una intención en una práctica.', author: 'Equipo QuoteFlow', category: 'Disciplina' },
  { id: 'seed-2', text: 'Lo que se mide con honestidad se puede mejorar.', author: 'Equipo QuoteFlow', category: 'Crecimiento' },
  { id: 'seed-3', text: 'Construye confianza antes de intentar escalar resultados.', author: 'Equipo QuoteFlow', category: 'Negocios' },
  { id: 'seed-4', text: 'Una audiencia es una relación, no solo un número.', author: 'Equipo QuoteFlow', category: 'Comunidad' }
];
const channels = ['Instagram', 'LinkedIn', 'Newsletter'];
const state = {
  quotes: JSON.parse(localStorage.getItem('qf-quotes') || 'null') || seedQuotes,
  queue: JSON.parse(localStorage.getItem('qf-queue') || '[]'),
  revenues: JSON.parse(localStorage.getItem('qf-revenues') || '[]'),
  weeklyGoal: 15
};
const $ = selector => document.querySelector(selector);
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

function save() {
  localStorage.setItem('qf-quotes', JSON.stringify(state.quotes));
  localStorage.setItem('qf-queue', JSON.stringify(state.queue));
  localStorage.setItem('qf-revenues', JSON.stringify(state.revenues));
}
function render() {
  const metrics = QuoteEngine.calculateMetrics(state.quotes, state.queue, state.revenues);
  $('#quoteCount').textContent = metrics.quoteCount;
  $('#categoryCount').textContent = `${metrics.categoryCount} categorías`;
  $('#queueCount').textContent = metrics.queued;
  $('#actualRevenue').textContent = money(metrics.actual);
  $('#valuePerPost').textContent = money(metrics.valuePerPost);
  $('#progressLabel').textContent = `${metrics.queued} de ${state.weeklyGoal}`;
  $('#progressBar').style.width = `${Math.min(100, metrics.queued / state.weeklyGoal * 100)}%`;
  $('#channelList').innerHTML = channels.map((channel, i) => {
    const count = state.queue.filter(item => item.channel === channel).length;
    return `<div><span class="channel c${i}">${channel[0]}</span><p><strong>${channel}</strong><small>${count} publicaciones preparadas</small></p><b>${count}</b></div>`;
  }).join('');
  renderQuotes();
}
function renderQuotes() {
  const query = $('#searchInput').value.toLowerCase();
  const filtered = state.quotes.filter(q => `${q.text} ${q.author} ${q.category}`.toLowerCase().includes(query));
  $('#quoteList').innerHTML = filtered.length ? filtered.map(q => `<article><span class="quote-mark">“</span><div><blockquote>${escapeHTML(q.text)}</blockquote><p>${escapeHTML(q.author)} · <span>${escapeHTML(q.category)}</span></p></div><button data-queue="${q.id}" aria-label="Añadir a la cola">＋</button></article>`).join('') : '<p class="empty">No encontramos frases con esa búsqueda.</p>';
}
function escapeHTML(value) { const node = document.createElement('div'); node.textContent = value; return node.innerHTML; }
function updateProjection() {
  const hourly = Number($('#hourlyGoal').value), hours = Number($('#hoursGoal').value);
  $('#hourlyOutput').textContent = money(hourly); $('#hoursOutput').textContent = `${hours} h`; $('#weeklyProjection').textContent = money(hourly * hours);
}

$('#addButton').addEventListener('click', () => $('#quoteDialog').showModal());
$('#recordButton').addEventListener('click', () => $('#revenueDialog').showModal());
$('#quoteForm').addEventListener('submit', event => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); state.quotes.unshift(QuoteEngine.normalizeQuote(data)); save(); render(); event.target.reset(); $('#quoteDialog').close(); });
$('#revenueForm').addEventListener('submit', event => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.target)); state.revenues.push({ ...data, amount: Number(data.amount), date: new Date().toISOString() }); save(); render(); event.target.reset(); $('#revenueDialog').close(); });
$('#quoteList').addEventListener('click', event => { const id = event.target.dataset.queue; if (!id) return; state.queue.push({ quoteId: id, channel: channels[state.queue.length % channels.length], status: 'queued' }); save(); render(); });
$('#queueButton').addEventListener('click', () => { if (!state.quotes.length) return; const quote = state.quotes[state.queue.length % state.quotes.length]; state.queue.push({ quoteId: quote.id, channel: channels[state.queue.length % channels.length], status: 'queued' }); save(); render(); });
$('#searchInput').addEventListener('input', renderQuotes);
$('#hourlyGoal').addEventListener('input', updateProjection); $('#hoursGoal').addEventListener('input', updateProjection);
$('#dismissNotice').addEventListener('click', event => event.currentTarget.closest('.notice').remove());
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
$('#importButton').addEventListener('click', () => $('#fileInput').click());
$('#fileInput').addEventListener('change', async event => { const file = event.target.files[0]; if (!file) return; try { const extension = file.name.split('.').pop().toLowerCase(); const imported = QuoteEngine.parseImport(await file.text(), extension); if (!imported.length) throw new Error('No se encontraron frases válidas.'); state.quotes = [...imported, ...state.quotes]; save(); render(); alert(`${imported.length} frases importadas.`); } catch (error) { alert(`No se pudo importar: ${error.message}`); } event.target.value = ''; });

render(); updateProjection();
