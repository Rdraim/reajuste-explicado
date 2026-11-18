<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# Histórico

## 2.1.0 — 2026-11-18

Correção: `estatisticas().mais_comum` devolvia a chave do grupo de 1 casa (4,39 virava 4,4; 4,14 virava 4,1). Agora devolve o valor de 2 casas mais frequente dentro do grupo vencedor; o agrupamento por 1 casa e `mais_comum_qtd` (contagem do grupo) seguem iguais.

- Campos novos, aditivos: `mais_comum_exato_qtd`, `mais_comum_grupo` e `percentuais_diferentes`.
- Desempates determinísticos, sem depender da ordem de entrada: entre grupos, mais itens e depois o grupo de valor menor; dentro do grupo, o mais frequente, depois o mais próximo da média do grupo e, por fim, o menor.
- A média passa a ser somada em ordem crescente, para que a ordem de entrada não mude o arredondamento.
- Valores não finitos continuam descartados.

Quem usava `mais_comum` como chave de 1 casa deve passar a ler `mais_comum_grupo`.

## 2.0.0 — 2026-10-07

Mudança principal: Node >=22 e validação mais estrita de entradas inválidas. Migre exemplos para importação local.

Núcleo sem dependências de runtime. Node.js 22 e 24 na CI. Instalação pelo Git; não há pacote deste projeto publicado no npm. Consulte Releases e fixe uma tag/commit ao integrar. Atualizações de dependências exigem análise de licença, engines e testes do consumidor. Um badge de CI não certifica segurança.
