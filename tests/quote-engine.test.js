const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeQuote, parseCSV, parseImport, calculateMetrics } = require('../quote-engine');

test('normaliza nombres de campos en español', () => {
  assert.deepEqual({ ...normalizeQuote({ frase: ' Sigue.', autor: 'Ana', categoria: 'Vida' }, 1), id: 'fixed' }, { id: 'fixed', text: 'Sigue.', author: 'Ana', category: 'Vida' });
});
test('importa JSON envuelto y descarta entradas vacías', () => {
  assert.equal(parseImport(JSON.stringify({ quotes: [{ text: 'Uno' }, { text: '' }] }), 'json').length, 1);
});
test('interpreta CSV con comas entre comillas', () => {
  assert.equal(parseCSV('text,author\n\"Hazlo bien, hoy\",Luz')[0].text, 'Hazlo bien, hoy');
});
test('calcula métricas solo con ingresos y publicaciones reales', () => {
  const result = calculateMetrics([{ category: 'A' }, { category: 'A' }], [{ status: 'published' }, { status: 'queued' }], [{ amount: 250 }]);
  assert.deepEqual(result, { quoteCount: 2, categoryCount: 1, queued: 2, actual: 250, valuePerPost: 250 });
});
