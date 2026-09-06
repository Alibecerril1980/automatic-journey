(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.QuoteEngine = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function normalizeQuote(item, index = 0) {
    if (typeof item === 'string') item = { text: item };
    const text = String(item.text || item.quote || item.frase || '').trim();
    if (!text) return null;
    return {
      id: String(item.id || `q-${Date.now()}-${index}`),
      text,
      author: String(item.author || item.autor || 'Autor desconocido').trim(),
      category: String(item.category || item.categoria || item.categoría || 'General').trim()
    };
  }

  function parseCSV(source) {
    const rows = source.trim().split(/\r?\n/).map(row => row.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(cell => cell.trim().replace(/^\"|\"$/g, '').replace(/\"\"/g, '\"')));
    if (rows.length < 2) return [];
    const headers = rows.shift().map(value => value.toLowerCase());
    return rows.map(row => Object.fromEntries(headers.map((header, i) => [header, row[i] || ''])));
  }

  function parseImport(source, extension) {
    const raw = extension === 'json' ? JSON.parse(source) : parseCSV(source);
    const items = Array.isArray(raw) ? raw : raw.quotes;
    if (!Array.isArray(items)) throw new Error('El archivo no contiene una lista de frases.');
    return items.map(normalizeQuote).filter(Boolean);
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function calculateMetrics(quotes, queue, revenues) {
    const actual = revenues.reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const published = queue.filter(item => item.status === 'published').length;
    return { quoteCount: quotes.length, categoryCount: new Set(quotes.map(q => q.category)).size, queued: queue.length, actual, valuePerPost: published ? actual / published : 0 };
  }

  return { normalizeQuote, parseCSV, parseImport, calculateMetrics, escapeHTML };
});
