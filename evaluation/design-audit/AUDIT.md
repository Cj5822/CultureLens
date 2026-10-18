# Design-audit notes

**Date:** 18 October 2026 · **Code:** commit `9e88a71` (the version used in the evaluation) ·
**Data:** the eight demonstration workbooks in `frontend/src/data/`

These notes verify every defect in report Table 10 (Section 5.5) against
the code. Each defect has a file and line reference, and
`npm run audit-checks` measures how often it shows up on the demonstration
data. Results are in `checks.md`. D8 was found during this check.

Method, as in Section 3.6: for each view, trace which entity set it reads
(all imported entities from `DataContext`, or the filtered set from
`FilterContext`), how it aggregates, and how it encodes the result. Then look
for questions that two views would answer differently.

| View | Entity set | Source |
|---|---|---|
| Map View (fill, tooltip counts) | all imported | `components/map/WorldMap.tsx:132` |
| Map View (country entity list) | filtered | `pages/MapView.tsx:17` |
| Analytics | filtered | `pages/Analytics.tsx:63` |
| Parallel Sets | filtered | `pages/ParallelSets.tsx:10` |
| Cluster Analysis | filtered | `pages/ClusterAnalysis.tsx:75` |
| Network Graph | filtered | `pages/NetworkGraph.tsx:15` |
| Text Analysis | all imported | `pages/TextAnalysis.tsx:87` |

## Defects

| ID | Status | Evidence | Effect on the demonstration data (`checks.md`) |
|---|---|---|---|
| D1 Merged word-cloud layout sized shared words by the larger count in both panes | **Fixed**, confirmed | Each pane sizes a word from its own count: `pages/TextAnalysis.tsx:72` (`sizeOf(wordMap.get(d.text))`); the joint layout only reserves space | — |
| D2 Detail panel lists only connections the entity *declared*; the graph is undirected | **Open**, confirmed | `components/detail/EntityDetailPanel.tsx:67-71` maps `entity.connections` only; the graph adds each edge in both directions | 13 of 78 entities list fewer connections than the graph shows; one shows "Connections 0" despite a visible edge |
| D3 Text Analysis ignores sidebar filters | **Open**, confirmed | `pages/TextAnalysis.tsx:87` reads `useDataContext()`, not `useFilterContext()` | With a "Germany only" filter, the five other views show 10 entities; Text Analysis still compares any two countries |
| D4 Map fill and tooltip counts are unfiltered; the country list is filtered | **Open**, confirmed | Fill: `components/map/WorldMap.tsx:132-147` (`useDataContext`); list: `pages/MapView.tsx:17-25` (`useFilterContext`) | With a "Germany only" filter, all 8 countries stay filled with their full counts |
| D5 Multi-valued attributes count in every group in Analytics and Cluster Analysis, but only by first value in Parallel Sets | **Open**, confirmed | `utils/analytics/grouping.ts:71,79` expand every value; `utils/analytics/parallelSets.ts:83,88` take `[0]` | Theme groups total 137 for 78 entities; e.g. "Inter- and Transcultural Competences" is 29 in Analytics but 4 in Parallel Sets |
| D6 "EU" drawn on Belgium; country names outside a 24-name lookup silently omitted | **Open**, confirmed | `components/map/WorldMap.tsx:14-39` (24 names, `'eu': 'BEL'`) and `:140` (`if (!iso3) continue`); `utils/excelParser.ts:49,61` (EU at Brussels; unknown country → (0, 0)) | 10 EU-level entities drawn on Belgium |
| D7 Stakeholder ITC text read from two fields and counted twice | **Fixed**, confirmed | Each distinct field value counted once per entity: `utils/textFrequency.ts:64-67` | — |
| D8 *(new)* Letters outside a–z split words in the word-frequency module | **Open**, new | `utils/textFrequency.ts:47` replaces every character outside `[a-z\s'-]` with a space before splitting | "Māori" → "ori" (11×), "Tapasā" → "tapas", "Länder" → "nder", "Öffnung" → "ffnung". For New Zealand, "ori" ties with "bicultural" (11 each), the answer to task 6 |

## Notes on D8

- **Consequence.** Words with macrons or umlauts show up in the word cloud and
  the RQ4 bar charts as fragments. Here that means Māori terms in the New
  Zealand data and German compounds with *Länder*. A participant who answered
  "Māori" for New Zealand in task 6 named a word exactly as large as
  "bicultural", but was marked wrong.
- **Fix.** Decompose and strip diacritics before tokenising, as
  `resolveConnections.ts` already does (`normalize('NFKD')` and remove
  combining marks), or tokenise on `\p{L}`. The fix was not applied: the
  application is kept at the version that was evaluated, so that the stimuli
  and answer keys can be reproduced.
