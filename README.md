# QuoteFlow

Un panel local y en español para convertir una biblioteca de frases en un plan de
publicación medible. QuoteFlow permite importar frases desde JSON o CSV, preparar
una cola por canales, registrar ingresos reales y comparar el avance con una meta.

> QuoteFlow no promete ingresos ni mueve dinero. Las proyecciones son escenarios
> matemáticos y deben sustituirse por resultados reales antes de tomar decisiones.

## Ejecutar

```bash
python3 -m http.server 4173
```

Abre <http://localhost:4173>. Los datos se guardan únicamente en `localStorage`
del navegador.

## Pruebas

```bash
node --test tests/quote-engine.test.js
```

## Formato de importación

JSON puede ser un arreglo de objetos con `text`, `author` y `category`, o un
objeto con una propiedad `quotes`. CSV debe tener encabezados equivalentes;
también se aceptan `quote`, `autor` y `categoria`.
