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

/* Distâncias comparadas em passos de 1e-9: ruído de ponto flutuante não decide empate. */
const distancia = (a, b) => Math.round(Math.abs(a - b) * 1e9);

/** Estatísticas descritivas; a moda não comprova índice contratual.

   A moda AGRUPA por 1 casa e DEVOLVE com 2. O agrupamento junta variações que
   diferem só pelo arredondamento do centavo (4,14 e 4,1496 caem no grupo 4,1).
   Devolver a chave do grupo, porém, mostraria um percentual que nenhum item
   teve (4,39 virava 4,4; 4,14 virava 4,1). `mais_comum` é o valor de 2 casas
   mais frequente DENTRO do grupo vencedor; `mais_comum_qtd` segue contando o
   grupo inteiro.

   O resultado não depende da ordem de entrada:
   - entre grupos: mais itens; empatados, o grupo de valor menor;
   - dentro do grupo: mais frequente; empatados, o mais próximo da média do
     grupo; persistindo, o menor. */
export function estatisticas(pcts) {
  const lista = (pcts || []).filter((p) => typeof p === 'number' && Number.isFinite(p));
  if (!lista.length) return null;
  const ord = [...lista].sort((a, b) => a - b);
  /* Percorre a lista ORDENADA: grupos e contagens saem iguais para qualquer ordem. */
  const grupos = new Map();
  const distintos = new Set();
  for (const p of ord) {
    const chave = p.toFixed(1);
    const g = grupos.get(chave) || { chave, menor: p, qtd: 0, exatos: new Map() };
    const exato = pct2(p);
    g.qtd += 1;
    g.exatos.set(exato, (g.exatos.get(exato) || 0) + 1);
    grupos.set(chave, g);
    distintos.add(exato);
  }
  /* `menor` só separa "-0.0" de "0.0", que têm o mesmo valor numérico. */
  const vencedor = [...grupos.values()].sort((a, b) => (b.qtd - a.qtd)
    || (Number(a.chave) - Number(b.chave))
    || (a.menor - b.menor))[0];
  const exatos = [...vencedor.exatos.entries()];
  const mediaGrupo = exatos.reduce((s, [v, q]) => s + v * q, 0) / vencedor.qtd;
  exatos.sort((a, b) => (b[1] - a[1])
    || (distancia(a[0], mediaGrupo) - distancia(b[0], mediaGrupo))
    || (a[0] - b[0]));
  const [maisComum, maisComumExatoQtd] = exatos[0];
  return {
    mais_comum: maisComum,                      // 2 casas: o valor que os itens tiveram
    mais_comum_qtd: vencedor.qtd,               // itens no grupo vencedor (1 casa)
    mais_comum_exato_qtd: maisComumExatoQtd,    // itens com exatamente `mais_comum`
    mais_comum_grupo: Number(vencedor.chave),   // chave do grupo vencedor (1 casa)
    percentuais_diferentes: distintos.size > 1, // mais de um valor distinto (2 casas)
    mediana: pct2(ord.length % 2 ? ord[Math.floor(ord.length / 2)] : (ord[ord.length / 2 - 1] + ord[ord.length / 2]) / 2),
    /* Somada em ordem crescente: a ordem de entrada não muda o arredondamento. */
    media: pct2(ord.reduce((s, x) => s + x, 0) / ord.length),
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
