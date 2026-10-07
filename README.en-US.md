# reajuste-explicado

**Language:** [PT-BR](README.md) · **EN-US** · [es-AR](README.es-AR.md)

A price-adjustment index that **reconciles with the total** — telling **price** apart from **volume**. Pure logic, zero dependencies, Node and browser.

## The problem

It is common for a screen to show the "adjustment" as the **average of the per-item changes**. That is wrong in two ways:

1. **It doesn't reconcile with the total.** If the bill went from `6,680.27` to `6,689.32`, it changed by **0.14%** — not the 4.72% applied to a few items. The right index is the one that, applied to the previous total, lands on the new total.
2. **It hides volume.** When the difference comes from an item that **entered** or **left** (not from price), no item "changes value" and the average says "0%", hiding the real change.

This package returns both sides: the total change **and** the price-only change, plus what entered and left.

## Install

```bash
npm install reajuste-explicado
```

Or copy `src/index.js` — a dependency-free ESM module.

## Usage

```js
import { analisarPeriodos, calcularReajuste } from 'reajuste-explicado';

// From the items of two periods ([{ id, valor }]):
const before = [{ id: 'a', valor: 599.70 }];
const after  = [{ id: 'a', valor: 599.70 }, { id: 'b', valor: 399.80 }];

analisarPeriodos(before, after);
// { pct: 66.67, pct_mesma_base: 0, entraram_valor: 399.80, sairam_valor: 0, ... }

// Or straight from totals you already summed:
calcularReajuste({ totalAnt: 6680.27, totalNovo: 6689.32, pcts: [4.72] });
// { pct: 0.14, delta: 9.05, por_item: { mais_comum: 4.72, ... }, ... }
```

## API

| function | description |
|---|---|
| `analisarPeriodos(previous, current)` | takes `[{ id, valor }]` for both periods and derives everything |
| `calcularReajuste({ totalAnt, totalNovo, pcts, baseAnt, baseNovo, valorEntraram, valorSairam })` | index from pre-summed totals |
| `variacao(from, to)` | percentage change (2 decimals); `null` with no base |
| `estatisticas(pcts)` | `{ mais_comum, mais_comum_qtd, mediana, media }` of per-item changes |
| `round2(n)` | 2-decimal financial rounding |

Output fields: `pct` (total change), `pct_mesma_base` (price only), `entraram_valor` / `sairam_valor` (volume), `delta`, `por_item` (stats; the **mode** is the contractual index that repeats).

## Limitations

- Works with **already-normalized numbers** (no currency parsing or FX).
- `round2` uses two decimals by contractual convention.
- Item identity is its `id`: items are the "same base" only when the `id` matches in both periods.

## Tests

```bash
node --test
```

## License

MIT © Rodrigo Rodrigues
