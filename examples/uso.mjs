import { analisarPeriodos, calcularReajuste } from '../src/index.js';

// Dois períodos de uma conta qualquer (valores sintéticos).
const antes = [{ id: 'item-1', valor: 215 }, { id: 'item-2', valor: 215 }, { id: 'item-3', valor: 39.25 }];
const depois = [{ id: 'item-1', valor: 225 }, { id: 'item-2', valor: 225 }, { id: 'item-4', valor: 180 }];

console.log('analisarPeriodos:', analisarPeriodos(antes, depois));

// Ou direto dos totais, quando você já os tem somados:
console.log('calcularReajuste:', calcularReajuste({ totalAnt: 1000, totalNovo: 1100, pcts: [20] }));
