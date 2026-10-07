<p align="right">
  <a href="README.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="README.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="README.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# reajuste-explicado

![reajuste-explicado](assets/support/project-pt-br.svg)

[![MIT](https://img.shields.io/github/license/Rdraim/reajuste-explicado?style=flat)](LICENSE) [![CI](https://img.shields.io/github/actions/workflow/status/Rdraim/reajuste-explicado/ci.yml?branch=main&label=CI&style=flat)](https://github.com/Rdraim/reajuste-explicado/actions) [![Release](https://img.shields.io/github/v/release/Rdraim/reajuste-explicado?style=flat)](https://github.com/Rdraim/reajuste-explicado/releases) [![Git](https://img.shields.io/github/last-commit/Rdraim/reajuste-explicado?label=Git&style=flat)](https://github.com/Rdraim/reajuste-explicado/commits/main) [![Stars](https://img.shields.io/github/stars/Rdraim/reajuste-explicado?style=social)](https://github.com/Rdraim/reajuste-explicado/stargazers) [![Forks](https://img.shields.io/github/forks/Rdraim/reajuste-explicado?style=social)](https://github.com/Rdraim/reajuste-explicado/forks)

<p>
  <a href="https://github.com/Rdraim/reajuste-explicado/tree/main/examples"><img src="assets/support/action-0-pt-br.svg" height="40" width="200" alt="Ver exemplos"></a>
  <a href="https://github.dev/Rdraim/reajuste-explicado"><img src="assets/support/action-1-pt-br.svg" height="40" width="200" alt="Editar no GitHub"></a>
  <a href="https://github.com/Rdraim/reajuste-explicado/archive/refs/heads/main.zip"><img src="assets/support/action-2-pt-br.svg" height="40" width="200" alt="Baixar código"></a>
</p>



Índice de reajuste que **explica a variação do total** — separando o que é **preço** do que é **volume**. Lógica pura, sem dependências, Node e navegador.

## O problema

É comum uma tela mostrar como "reajuste" a **média das variações item a item**. Isso erra de dois jeitos:

1. **Não fecha com o total.** Se a conta foi de `1.000,00` para `1.100,00`, ela variou **10%** — não os 20% aplicados em alguns itens. O índice certo é aquele que, aplicado ao total anterior, chega no total novo.
2. **Some com o efeito de volume.** Quando a diferença vem de um item que **entrou** ou **saiu** (e não de preço), nenhum item "muda de valor" e a média diz "0%", escondendo a variação real da conta.

Este pacote devolve os dois lados, sem esconder nada: a variação do total **e** a variação só de preço, mais o que entrou e saiu.

## Instalação

```bash
git clone https://github.com/Rdraim/reajuste-explicado.git
cd reajuste-explicado
npm test
```

Ou copie `src/index.js` — é um módulo ESM sem dependências.

## Uso

```js
import { analisarPeriodos, calcularReajuste } from './src/index.js';

// A partir dos itens de dois períodos ([{ id, valor }]):
const antes  = [{ id: 'a', valor: 60 }];
const depois = [{ id: 'a', valor: 60 }, { id: 'b', valor: 40 }];

analisarPeriodos(antes, depois);
// {
//   pct: 66.67,            // o total subiu 66,67%
//   pct_mesma_base: 0,     // mas o preço do item 'a' não mudou
//   entraram_valor: 40,// a diferença veio de volume (item 'b' entrou)
//   sairam_valor: 0,
//   ...
// }

// Ou direto dos totais, quando você já os somou:
calcularReajuste({ totalAnt: 1000, totalNovo: 1100, pcts: [20] });
// { pct: 10, delta: 100, por_item: { mais_comum: 20, ... }, ... }
```

## API

| função | descrição |
|---|---|
| `analisarPeriodos(anterior, novo)` | recebe `[{ id, valor }]` dos dois períodos e deriva tudo |
| `calcularReajuste({ totalAnt, totalNovo, pcts, baseAnt, baseNovo, valorEntraram, valorSairam })` | índice a partir de totais já somados |
| `variacao(de, para)` | variação percentual (2 casas); `null` se não há base |
| `estatisticas(pcts)` | `{ mais_comum, mais_comum_qtd, mediana, media }` das variações item a item |
| `round2(n)` | arredondamento financeiro a 2 casas |

Campos da saída: `pct` (variação do total), `pct_mesma_base` (preço puro), `entraram_valor` / `sairam_valor` (volume), `delta`, `por_item` (estatísticas; a **moda** descreve o percentual mais frequente).

## Limitações

- Trabalha com **números já normalizados** (não faz parsing de moeda nem câmbio).
- `round2` arredonda a duas casas; use delta e totais para conciliar, não o percentual arredondado.
- Identidade do item é a sua `id`: itens só são "a mesma base" quando têm a mesma `id` nos dois períodos.

## Testes

```bash
node --test
```

## Licença

MIT © Rodrigo Rodrigues

Valores devem ser finitos; ids ausentes/duplicados são rejeitados. Mediana par usa a média central. Percentuais são arredondados: pct não reproduz necessariamente o total exato; use delta para reconciliar. Números JS têm precisão limitada; não substitui um livro contábil decimal. A moda não comprova índice contratual.

## ☕ Me pague um café

Este projeto te ajudou a resolver um problema, aprender algo novo ou dar os primeiros passos no desenvolvimento? Se você sentir vontade de apoiar meu trabalho, um café é uma forma carinhosa de agradecer.

Sou **Rodrigo Rodrigues**, criador do **Nexus** e destes projetos de código aberto. Seu apoio me ajuda a dedicar tempo para melhorar o código, escrever exemplos mais claros e continuar compartilhando o que aprendo.

**Contribua com o valor que fizer sentido para você. O apoio é totalmente voluntário — o projeto continua gratuito sob a licença MIT.**

<p>
  <a href="#apoie-com-pix"><img src="assets/support/pix-pt-br.svg" width="190" height="44" alt="Apoiar com Pix"></a>
  <a href="https://github.com/Rdraim/reajuste-explicado/issues/new?title=Coment%C3%A1rio%3A%20este%20projeto%20me%20ajudou"><img src="assets/support/comment-pt-br.svg" width="210" height="44" alt="Deixar um comentário"></a>
</p>

### Apoie com Pix

No aplicativo do seu banco, escaneie o QR Code ou copie a chave Pix abaixo. Escolha o valor e confira os dados do destinatário antes de confirmar.

<p align="center">
  <img src="assets/support/pix-qr.png" width="260" alt="QR Code Pix original fornecido por Rodrigo Rodrigues; a chave em texto abaixo é uma alternativa.">
</p>

**Chave Pix**

```text
8875a24e-44d1-4c91-b6bb-62c9f0070955
```

Você também pode apoiar compartilhando o projeto, relatando um problema, melhorando a documentação ou deixando um comentário.

### Seu comentário também faz diferença

[Conte como o projeto te ajudou](https://github.com/Rdraim/reajuste-explicado/issues/new?title=Coment%C3%A1rio%3A%20este%20projeto%20me%20ajudou). Vou gostar de saber o que você criou, o que aprendeu e o que poderia ficar mais claro para quem está começando.

O comentário é bem-vindo com ou sem doação. Preserve sua privacidade: não publique comprovantes, dados pessoais, credenciais ou informações de usuários nas Issues.

---

**Obrigado por apoiar meu trabalho e me ajudar a continuar criando e compartilhando. ❤️**
