/* ============================================================================
   reajuste-explicado — índice de reajuste que FECHA com o total, separando
   preço (mesma base) de volume (entradas e saídas). Lógica pura, sem dependência.

   Problema que resolve: muita tela mostra como "reajuste" a MÉDIA das variações
   item a item. Isso dá dois erros clássicos:

   1. A média por item não representa a variação ponderada do total.
   2. Quando a diferença vem de item que ENTROU ou SAIU (volume, não preço),
      nenhum item "muda de valor" e a média diz "0%" — escondendo a variação.

   A saída traz os dois separados: `pct` (variação do total) e `pct_mesma_base`
   (preço puro, só os itens presentes nos dois períodos), mais o que entrou/saiu.
   ============================================================================ */

/** Valores devem ser finitos; entradas inválidas nunca viram zero silenciosamente. */
const numero = (n) => {
  if (typeof n !== 'number' && (typeof n !== 'string' || !n.trim())) throw new TypeError('Valor numérico obrigatório');
  const v = Number(n);
  if (!Number.isFinite(v)) throw new TypeError('Valor deve ser finito');
  return v;
};
export const round2 = (n) => {
  const v = numero(n);
  if (Math.abs(v) > Number.MAX_SAFE_INTEGER / 100) throw new RangeError('Valor excede precisão em centavos');
  return Math.sign(v) * Math.round((Math.abs(v) + Number.EPSILON) * 100) / 100;
};
const pct2 = round2;

/** Variação percentual de `de` para `para`, 2 casas. `null` quando não há base
   (sem base, "+100%" ou "0%" seria inventado). */
export function variacao(de, para) {
  const base = numero(de);
  const destino = numero(para);
  if (base <= 0) return null;
  return pct2((destino / base - 1) * 100);
}

/** Estatísticas descritivas; a moda não comprova índice contratual. */
export function estatisticas(pcts) {
  const lista = (pcts || []).filter((p) => typeof p === 'number' && Number.isFinite(p));
  if (!lista.length) return null;
  const ord = [...lista].sort((a, b) => a - b);
  const cont = {};
  for (const p of lista) { const k = p.toFixed(1); cont[k] = (cont[k] || 0) + 1; }
  const [moda, qtd] = Object.entries(cont).sort((a, b) => b[1] - a[1])[0];
  return {
    mais_comum: Number(moda),
    mais_comum_qtd: qtd,
    mediana: pct2(ord.length % 2 ? ord[Math.floor(ord.length / 2)] : (ord[ord.length / 2 - 1] + ord[ord.length / 2]) / 2),
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
    pct: variacao(ant, novo),               // variação percentual arredondada
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
  const indexar = (itens) => {
    if (!Array.isArray(itens)) throw new TypeError('Período deve ser uma lista');
    const mapa = new Map();
    for (const i of itens) {
      if (!i || !['string', 'number'].includes(typeof i.id) || !String(i.id).trim()) throw new TypeError('Item sem identificador');
      const id = String(i.id);
      if (mapa.has(id)) throw new TypeError('Identificador duplicado: ' + id);
      mapa.set(id, numero(i.valor));
    }
    return mapa;
  };
  const mapA = indexar(anterior);
  const mapB = indexar(novo);
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
