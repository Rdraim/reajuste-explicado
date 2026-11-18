<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# Changelog

## 2.1.0 — 2026-11-18

Fix: `estatisticas().mais_comum` returned the 1-decimal group key (4.39 became 4.4; 4.14 became 4.1). It now returns the most frequent 2-decimal value inside the winning group; 1-decimal grouping and `mais_comum_qtd` (group count) are unchanged.

- New additive fields: `mais_comum_exato_qtd`, `mais_comum_grupo` and `percentuais_diferentes`.
- Deterministic tie-breaks, independent of input order: between groups, more items, then the lower-valued group; inside the group, the most frequent, then the closest to the group mean, then the lowest.
- The mean is now summed in ascending order, so input order cannot change its rounding.
- Non-finite values are still discarded.

If you used `mais_comum` as the 1-decimal key, read `mais_comum_grupo` instead.

## 2.0.0 — 2026-10-07

Major change: Node >=22 and stricter invalid-input validation. Migrate examples to local imports.

No runtime dependencies in the core. CI targets Node.js 22 and 24. Install from Git; this project is not published on npm. Review Releases and pin a tag/commit for integration. Dependency updates require license, engine and consumer test review. A CI badge is not a security certification.
