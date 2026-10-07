# reajuste-explicado

**Idioma:** **PT-BR** · [EN-US](README.en-US.md) · [es-AR](README.es-AR.md)

Índice de reajuste que **fecha com o total** — separando o que é **preço** do que é **volume**. Lógica pura, sem dependências, Node e navegador.

## O problema

É comum uma tela mostrar como "reajuste" a **média das variações item a item**. Isso erra de dois jeitos:

1. **Não fecha com o total.** Se a conta foi de `6.680,27` para `6.689,32`, ela variou **0,14%** — não os 4,72% aplicados em alguns itens. O índice certo é aquele que, aplicado ao total anterior, chega no total novo.
2. **Some com o efeito de volume.** Quando a diferença vem de um item que **entrou** ou **saiu** (e não de preço), nenhum item "muda de valor" e a média diz "0%", escondendo a variação real da conta.

Este pacote devolve os dois lados, sem esconder nada: a variação do total **e** a variação só de preço, mais o que entrou e saiu.

## Instalação

```bash
npm install reajuste-explicado
```

Ou copie `src/index.js` — é um módulo ESM sem dependências.

## Uso

```js
import { analisarPeriodos, calcularReajuste } from 'reajuste-explicado';

// A partir dos itens de dois períodos ([{ id, valor }]):
const antes  = [{ id: 'a', valor: 599.70 }];
const depois = [{ id: 'a', valor: 599.70 }, { id: 'b', valor: 399.80 }];

analisarPeriodos(antes, depois);
// {
//   pct: 66.67,            // o total subiu 66,67%
//   pct_mesma_base: 0,     // mas o preço do item 'a' não mudou
//   entraram_valor: 399.80,// a diferença veio de volume (item 'b' entrou)
//   sairam_valor: 0,
//   ...
// }

// Ou direto dos totais, quando você já os somou:
calcularReajuste({ totalAnt: 6680.27, totalNovo: 6689.32, pcts: [4.72] });
// { pct: 0.14, delta: 9.05, por_item: { mais_comum: 4.72, ... }, ... }
```

## API

| função | descrição |
|---|---|
| `analisarPeriodos(anterior, novo)` | recebe `[{ id, valor }]` dos dois períodos e deriva tudo |
| `calcularReajuste({ totalAnt, totalNovo, pcts, baseAnt, baseNovo, valorEntraram, valorSairam })` | índice a partir de totais já somados |
| `variacao(de, para)` | variação percentual (2 casas); `null` se não há base |
| `estatisticas(pcts)` | `{ mais_comum, mais_comum_qtd, mediana, media }` das variações item a item |
| `round2(n)` | arredondamento financeiro a 2 casas |

Campos da saída: `pct` (variação do total), `pct_mesma_base` (preço puro), `entraram_valor` / `sairam_valor` (volume), `delta`, `por_item` (estatísticas; a **moda** é o índice contratual que se repete).

## Limitações

- Trabalha com **números já normalizados** (não faz parsing de moeda nem câmbio).
- `round2` usa duas casas por convenção contratual; mais casas dariam um índice que não reproduz o total na conta à mão.
- Identidade do item é a sua `id`: itens só são "a mesma base" quando têm a mesma `id` nos dois períodos.

## Testes

```bash
node --test
```

## Licença

MIT © Rodrigo Rodrigues
