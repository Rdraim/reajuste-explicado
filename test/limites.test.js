import {test} from 'node:test';import assert from 'node:assert/strict';import {round2,estatisticas,analisarPeriodos} from '../src/index.js';
test('mediana par e valores não finitos',()=>{assert.equal(estatisticas([2,4]).mediana,3);assert.equal(estatisticas([Infinity]),null);assert.throws(()=>round2('erro'),TypeError);});
test('identidades ausentes e duplicadas nunca somem',()=>{assert.throws(()=>analisarPeriodos([{valor:10}]),TypeError);assert.throws(()=>analisarPeriodos([{id:'A',valor:10},{id:'A',valor:20}]),TypeError);});
test('reconciliação sintética de preço e volume',()=>{const r=analisarPeriodos([{id:'A',valor:100},{id:'B',valor:50}],[{id:'A',valor:110},{id:'C',valor:70}]);assert.equal(r.delta,30);assert.equal(r.base_novo-r.base_ant+r.entraram_valor-r.sairam_valor,r.delta);});
