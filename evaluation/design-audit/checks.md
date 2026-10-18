# Design-audit checks on the demonstration workbooks

Generated 2026-10-18T00:37:43.896Z by `npm run audit-checks`.

- **D2** 13 of 78 entities have more neighbours in the graph than their detail panel lists; 1 show "Connections 0" while having visible edges (e.g. Belgrade Open School: 1 edge(s)).
- **D3/D4** With the filter country = Germany, the filtered views show 10 entities, while Text Analysis can still compare any country and the map still fills all 8 countries with their full counts.
- **D5** 78 entities, but thematic-focus groups in Analytics and Cluster Analysis total 137 and geographical-scope groups 78. Per theme (Analytics vs Parallel Sets primary theme): Education 40 vs 37; Migration 32 vs 21; Inter- and Transcultural Competences 29 vs 4; Culture 26 vs 10; Other 9 vs 5; Inter- and Transculturality 1 vs 1.
- **D6** 10 EU-level entities are drawn on Belgium.
- **D8** Words split by the word-frequency module: "Māori" → "ori" (11×, New Zealand); "Tapasā" → "tapas" (4×, New Zealand); "Länder" → "nder" (2×, Germany); "cross-Länder" → "cross-l" + "nder" (1×, Germany); "Öffnung" → "ffnung" (1×, Germany); "federal-Länder" → "federal-l" + "nder" (1×, Germany); "Tapasā's" → "tapas" (1×, New Zealand).
