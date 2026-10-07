# reajuste-explicado

**Idioma:** [PT-BR](README.md) · [EN-US](README.en-US.md) · **es-AR**

Un índice de ajuste de precios que **cierra con el total** — distinguiendo **precio** de **volumen**. Lógica pura, sin dependencias, Node y navegador.

## El problema

Es común que una pantalla muestre el "ajuste" como el **promedio de las variaciones ítem por ítem**. Eso falla de dos maneras:

1. **No cierra con el total.** Si la cuenta pasó de `6.680,27` a `6.689,32`, varió **0,14%** — no el 4,72% aplicado a unos pocos ítems. El índice correcto es el que, aplicado al total anterior, llega al total nuevo.
2. **Oculta el volumen.** Cuando la diferencia viene de un ítem que **entró** o **salió** (y no del precio), ningún ítem "cambia de valor" y el promedio dice "0%", ocultando el cambio real.

Este paquete devuelve ambos lados: la variación del total **y** la variación solo de precio, más lo que entró y salió.

## Instalación

```bash
npm install reajuste-explicado
```

O copiá `src/index.js` — un módulo ESM sin dependencias.

## Uso

```js
import { analisarPeriodos, calcularReajuste } from 'reajuste-explicado';

// A partir de los ítems de dos períodos ([{ id, valor }]):
const antes   = [{ id: 'a', valor: 599.70 }];
const despues = [{ id: 'a', valor: 599.70 }, { id: 'b', valor: 399.80 }];

analisarPeriodos(antes, despues);
// { pct: 66.67, pct_mesma_base: 0, entraram_valor: 399.80, sairam_valor: 0, ... }

// O directo desde los totales que ya sumaste:
calcularReajuste({ totalAnt: 6680.27, totalNovo: 6689.32, pcts: [4.72] });
// { pct: 0.14, delta: 9.05, por_item: { mais_comum: 4.72, ... }, ... }
```

## API

| función | descripción |
|---|---|
| `analisarPeriodos(anterior, actual)` | toma `[{ id, valor }]` de ambos períodos y deriva todo |
| `calcularReajuste({ totalAnt, totalNovo, pcts, baseAnt, baseNovo, valorEntraram, valorSairam })` | índice desde totales ya sumados |
| `variacao(de, a)` | variación porcentual (2 decimales); `null` sin base |
| `estatisticas(pcts)` | `{ mais_comum, mais_comum_qtd, mediana, media }` de las variaciones |
| `round2(n)` | redondeo financiero a 2 decimales |

Campos de salida: `pct` (variación del total), `pct_mesma_base` (solo precio), `entraram_valor` / `sairam_valor` (volumen), `delta`, `por_item` (estadísticas; la **moda** es el índice contractual que se repite).

## Limitaciones

- Trabaja con **números ya normalizados** (no parsea moneda ni cambio).
- `round2` usa dos decimales por convención contractual.
- La identidad del ítem es su `id`: son "la misma base" solo cuando el `id` coincide en ambos períodos.

## Tests

```bash
node --test
```

## Licencia

MIT © Rodrigo Rodrigues
