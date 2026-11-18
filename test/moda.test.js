import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estatisticas, analisarPeriodos } from '../src/index.js';

/* A moda agrupa por 1 casa e devolve o valor de 2 casas mais frequente dentro
   do grupo vencedor. Valores sintéticos. */

test('4,39 em vários itens devolve 4,39, não a chave do grupo (4,4)', () => {
  const e = estatisticas([4.39, 4.39, 4.39, 2.5]);
  assert.equal(e.mais_comum, 4.39);
  assert.equal(e.mais_comum_grupo, 4.4);
  assert.equal(e.mais_comum_qtd, 3);
  assert.equal(e.mais_comum_exato_qtd, 3);
});

test('4,39 e 4,40 no mesmo grupo: vence o de 2 casas mais frequente', () => {
  const a = estatisticas([4.39, 4.39, 4.4]);
  assert.equal(a.mais_comum, 4.39);
  assert.equal(a.mais_comum_qtd, 3);       // o grupo 4,4 inteiro
  assert.equal(a.mais_comum_exato_qtd, 2);
  const b = estatisticas([4.4, 4.4, 4.39]);
  assert.equal(b.mais_comum, 4.4);
  assert.equal(b.mais_comum_exato_qtd, 2);
});

test('variações vindas de analisarPeriodos: 4,39 vence 4,40 dentro do grupo', () => {
  const ant = [{ id: 'a', valor: 100 }, { id: 'b', valor: 200 }, { id: 'c', valor: 50 }, { id: 'd', valor: 80 }];
  const novo = [{ id: 'a', valor: 104.39 }, { id: 'b', valor: 208.78 }, { id: 'c', valor: 52.2 }, { id: 'd', valor: 82 }];
  const e = analisarPeriodos(ant, novo).por_item;
  assert.equal(e.mais_comum, 4.39);
  assert.equal(e.mais_comum_grupo, 4.4);
  assert.equal(e.mais_comum_qtd, 3);
  assert.equal(e.mais_comum_exato_qtd, 2);
});

test('4,14 x5 e 4,15 x2 devolve 4,14, não 4,1', () => {
  /* O literal 4,15 é guardado como 4,15000000000000036 e toFixed(1) o leva
     ao grupo 4,2; o grupo 4,1 fica com os cinco 4,14. */
  const e = estatisticas([4.14, 4.15, 4.14, 4.14, 4.15, 4.14, 4.14]);
  assert.equal(e.mais_comum, 4.14);
  assert.equal(e.mais_comum_grupo, 4.1);
  assert.equal(e.mais_comum_qtd, 5);
  assert.equal(e.mais_comum_exato_qtd, 5);
  assert.equal(e.percentuais_diferentes, true);
});

test('4,15 com 2 casas dentro do grupo 4,1 (variação bruta 4,1496)', () => {
  const a = estatisticas([4.14, 4.14, 4.14, 4.14, 4.14, 4.1496, 4.1496]);
  assert.equal(a.mais_comum, 4.14);
  assert.equal(a.mais_comum_qtd, 7);       // os sete no grupo 4,1
  assert.equal(a.mais_comum_exato_qtd, 5);
  const b = estatisticas([4.1496, 4.1496, 4.1496, 4.14, 4.14]);
  assert.equal(b.mais_comum, 4.15);
  assert.equal(b.mais_comum_grupo, 4.1);
  assert.equal(b.mais_comum_exato_qtd, 3);
});

test('empate dentro do grupo: o mais próximo da média do grupo e, persistindo, o menor', () => {
  assert.equal(estatisticas([4.11, 4.12, 4.14]).mais_comum, 4.12);
  assert.equal(estatisticas([4.14, 4.11, 4.12]).mais_comum, 4.12);
  assert.equal(estatisticas([4.14, 4.1496]).mais_comum, 4.14);
  assert.equal(estatisticas([4.1496, 4.14]).mais_comum, 4.14);
});

test('empate de grupos: vence o grupo de valor menor, em qualquer ordem', () => {
  for (const l of [[4.39, 4.39, 6.1, 6.1], [6.1, 6.1, 4.39, 4.39], [6.1, 4.39, 6.1, 4.39]]) {
    const e = estatisticas(l);
    assert.equal(e.mais_comum, 4.39);
    assert.equal(e.mais_comum_grupo, 4.4);
    assert.equal(e.mais_comum_qtd, 2);
  }
});

test('ordem embaralhada dá exatamente o mesmo resultado', () => {
  const base = [4.14, 4.1496, 6.1, 6.1, 9, 9.04];
  const perms = (l) => (l.length <= 1 ? [l]
    : l.flatMap((x, i) => perms([...l.slice(0, i), ...l.slice(i + 1)]).map((p) => [x, ...p])));
  const esperado = estatisticas(base);
  for (const p of perms(base)) assert.deepEqual(estatisticas(p), esperado);
  assert.equal(esperado.mais_comum, 4.14); // três grupos com 2 itens: vence o 4,1

  /* Lista maior, embaralhada com semente fixa. */
  const longa = [5.25, 5.25, 5.24, 5.2496, 3.1, 3.1, 3.1, 3.14, 7.7, 7.7, 7.7, 7.71, 0.5];
  const ref = estatisticas(longa);
  let semente = 7;
  const aleatorio = () => (semente = (semente * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let n = 0; n < 50; n++) {
    const l = [...longa];
    for (let i = l.length - 1; i > 0; i--) { const j = Math.floor(aleatorio() * (i + 1)); [l[i], l[j]] = [l[j], l[i]]; }
    assert.deepEqual(estatisticas(l), ref);
  }
});

test('percentuais_diferentes só quando há mais de um valor distinto', () => {
  assert.equal(estatisticas([20]).percentuais_diferentes, false);
  assert.equal(estatisticas([4.39, 4.39, 4.39]).percentuais_diferentes, false);
  assert.equal(estatisticas([4.39, 4.39, 4.4]).percentuais_diferentes, true);
});

test('valores não finitos continuam descartados', () => {
  const e = estatisticas([Infinity, NaN, 4.39, -Infinity, 4.39]);
  assert.equal(e.mais_comum, 4.39);
  assert.equal(e.mais_comum_qtd, 2);
  assert.equal(e.percentuais_diferentes, false);
  assert.equal(estatisticas([NaN, Infinity]), null);
});
