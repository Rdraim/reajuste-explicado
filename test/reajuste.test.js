import { test } from 'node:test';
import assert from 'node:assert/strict';
import { round2, variacao, estatisticas, calcularReajuste, analisarPeriodos } from '../src/index.js';

test('o índice é o que fecha com o total, não a média dos itens', () => {
  const r = calcularReajuste({ totalAnt: 1000, totalNovo: 1100, pcts: [20] });
  assert.equal(r.pct, 10);
  assert.equal(r.delta, 100);
});

test('variação sem base é null (não inventa 100%/0%)', () => {
  assert.equal(variacao(0, 500), null);
  assert.equal(variacao(-1, 500), null);
  assert.equal(variacao(100, 150), 50);
});

test('mudança só de volume aparece como entrada, não como reajuste de preço', () => {
  const ant = [{ id: 'a', valor: 60 }];
  const novo = [{ id: 'a', valor: 60 }, { id: 'b', valor: 40 }];
  const r = analisarPeriodos(ant, novo);
  assert.equal(r.pct, 66.67);
  assert.equal(r.pct_mesma_base, 0);
  assert.equal(r.entraram_valor, 40);
  assert.equal(r.sairam_valor, 0);
});

test('a moda descreve frequências sem comprovar contrato', () => {
  const e = estatisticas([5, 5, 5, 20]);
  assert.equal(e.mais_comum, 5);
  assert.equal(e.mais_comum_qtd, 3);
  assert.notEqual(e.media, e.mais_comum);
});

test('round2 arredonda a duas casas', () => {
  assert.equal(round2(1.005), 1.01);
  assert.equal(round2(2.344), 2.34);
});

test('sem itens em comum: por_item é null, entradas e saídas somam', () => {
  const r = analisarPeriodos([{ id: 'x', valor: 10 }], [{ id: 'y', valor: 20 }]);
  assert.equal(r.por_item, null);
  assert.equal(r.sairam_valor, 10);
  assert.equal(r.entraram_valor, 20);
});
