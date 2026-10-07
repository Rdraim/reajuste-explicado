/* ============================================================================
   reajuste-explicado — índice de reajuste que FECHA com o total, separando
   preço (mesma base) de volume (entradas e saídas). Lógica pura, sem dependência.

   Problema que resolve: muita tela mostra como "reajuste" a MÉDIA das variações
   item a item. Isso dá dois erros clássicos:

   1. O número não fecha com o total. Um total que vai de 6.680,27 para 6.689,32
      variou 0,14%, não os 4,72% aplicados em poucos itens. O índice certo é o
      que, aplicado ao total anterior, chega no total novo.
   2. Quando a diferença vem de item que ENTROU ou SAIU (volume, não preço),
      nenhum item "muda de valor" e a média diz "0%" — escondendo a variação.

   A saída traz os dois separados: `pct` (variação do total) e `pct_mesma_base`
   (preço puro, só os itens presentes nos dois períodos), mais o que entrou/saiu.
   ============================================================================ */

/** Arredonda a 2 casas, como contrato e boletim usam. */
export const round2 = (n) => Math.round(((Number(n) || 0) + Number.EPSILON) * 100) / 100;

const pct2 = round2;

/** Variação percentual de `de` para `para`, 2 casas. `null` quando não há base
   (sem base, "+100%" ou "0%" seria inventado). */
export function variacao(de, para) {
  const base = Number(de) || 0;
  if (base <= 0) return null;
  return pct2(((Number(para) || 0) / base - 1) * 100);
}

/** Estatísticas das variações item a item. A MODA é o índice contratual: ao
   reajustar por contrato aplica-se o mesmo percentual em vários itens, e é ele
   que se repete; a média se deixa levar por um único item trocado. */
export function estatisticas(pcts) {
  const lista = (pcts || []).filter((p) => typeof p === 'number' && !Number.isNaN(p));
  if (!lista.length) return null;
  const ord = [...lista].sort((a, b) => a - b);
  const cont = {};
  for (const p of lista) { const k = p.toFixed(1); cont[k] = (cont[k] || 0) + 1; }
  const [moda, qtd] = Object.entries(cont).sort((a, b) => b[1] - a[1])[0];
  return {
    mais_comum: Number(moda),
    mais_comum_qtd: qtd,
    mediana: pct2(ord[Math.floor(ord.length / 2)]),
    media: pct2(lista.reduce((s, x) => s + x, 0) / lista.length),
  };
}

/** Índice de reajuste a partir de totais já somados. */
export function calcularReajuste({
  totalAnt, totalNovo,
  pcts = [],
  baseAnt = 0, baseNovo = 0,
  valorEntraram = 0, valorSairam = 0,
} = {}) {
  const ant = round2(totalAnt);
  const novo = round2(totalNovo);
  return {
    pct: variacao(ant, novo),               // o índice que fecha a conta
    total_ant: ant,
    total_novo: novo,
    delta: round2(novo - ant),
    pct_mesma_base: variacao(baseAnt, baseNovo), // preço puro (mesmo parque)
    base_ant: round2(baseAnt),
    base_novo: round2(baseNovo),
    entraram_valor: round2(valorEntraram),  // volume que explica pct vs base
    sairam_valor: round2(valorSairam),
    itens_reajustados: (pcts || []).length,
    por_item: estatisticas(pcts),
  };
}

/** Conveniência: recebe os itens dos dois períodos ([{ id, valor }]) e deriva
   totais, mesma base (itens nos dois), entradas/saídas e variações item a item. */
export function analisarPeriodos(anterior = [], novo = []) {
  const mapA = new Map(anterior.map((i) => [String(i.id), Number(i.valor) || 0]));
  const mapB = new Map(novo.map((i) => [String(i.id), Number(i.valor) || 0]));
  let baseAnt = 0, baseNovo = 0, valorEntraram = 0, valorSairam = 0;
  const pcts = [];
  for (const [id, va] of mapA) {
    if (mapB.has(id)) {
      const vb = mapB.get(id);
      baseAnt += va; baseNovo += vb;
      const v = variacao(va, vb);
      if (v !== null) pcts.push(v);
    } else {
      valorSairam += va;
    }
  }
  for (const [id, vb] of mapB) if (!mapA.has(id)) valorEntraram += vb;
  const totalAnt = [...mapA.values()].reduce((s, x) => s + x, 0);
  const totalNovo = [...mapB.values()].reduce((s, x) => s + x, 0);
  return calcularReajuste({ totalAnt, totalNovo, pcts, baseAnt, baseNovo, valorEntraram, valorSairam });
}

export default { round2, variacao, estatisticas, calcularReajuste, analisarPeriodos };
