<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# Historial

## 2.1.0 — 2026-11-18

Corrección: `estatisticas().mais_comum` devolvía la clave del grupo de 1 decimal (4,39 pasaba a 4,4; 4,14 pasaba a 4,1). Ahora devuelve el valor de 2 decimales más frecuente dentro del grupo ganador; el agrupamiento por 1 decimal y `mais_comum_qtd` (cantidad del grupo) no cambian.

- Campos nuevos, aditivos: `mais_comum_exato_qtd`, `mais_comum_grupo` y `percentuais_diferentes`.
- Desempates deterministas, independientes del orden de entrada: entre grupos, más ítems y después el grupo de menor valor; dentro del grupo, el más frecuente, después el más cercano al promedio del grupo y, por último, el menor.
- El promedio ahora se suma en orden creciente, así el orden de entrada no cambia su redondeo.
- Los valores no finitos se siguen descartando.

Si usabas `mais_comum` como clave de 1 decimal, pasá a leer `mais_comum_grupo`.

## 2.0.0 — 2026-10-07

Cambio mayor: Node >=22 y validación más estricta. Migrá ejemplos a imports locales.

Núcleo sin dependencias de ejecución. CI con Node.js 22 y 24. Instalación desde Git; este proyecto no está publicado en npm. Revisá Releases y fijá una tag/commit al integrar. Actualizaciones requieren revisar licencia, engines y pruebas del consumidor. Un badge de CI no certifica seguridad.
