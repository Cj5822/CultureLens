# Answer key and dataset facts

Generated 2026-10-17T13:10:07.315Z by `npm run answer-key` from 8 workbook(s).

## Per-view tasks (report Table 4)

| View | Task | Answer |
|---|---|---|
| Map View | Which country has the most "highly influential" stakeholders, and how many? | New Zealand, 4 (all: New Zealand 4, EU 3, Germany 3, Norway 3, Finland 2, Italy 2, Greece 1, Serbia 1) |
| Analytics | How many instruments are at the "implementation" stage? | 19 |
| Parallel Sets | With columns Type and Impact/Influence, how many "law" entries are "binding"? | 8 |
| Cluster Analysis | How many stakeholders are in the "administration" cluster (by Actor Type)? | 11 |
| Network Graph | How many steps from BMBF to Diakonie Deutschland? | 2 (Federal Ministry of Education and Research (BMBF) → Federal Office for Migration and Refugees (BAMF) → Diakonie Deutschland) |
| Text Analysis | Ignoring "itc", what is the largest word for Germany and for New Zealand? | Germany: integration (14; next federal 11, policy 9); New Zealand: bicultural (11; next ori 11, mandate 10) |

## Dataset facts (report Section 5.3)

- Entities: 78 (48 stakeholders, 30 instruments); parse warnings: 0
- Per country: EU 6+4, Finland 6+4, Germany 6+4, Greece 6+4, Italy 6+4, New Zealand 6+4, Serbia 6+4, Norway 6+2
- Entities declaring at least one connection: 71
- Raw connection references: 137; resolved: 137; unresolved: 0
- Undirected edges: 77; cross-country edges: 2
  - Ministry of Education and Culture (Finland) — European Commission – DG Education and Culture (DG EAC) (EU)
  - Serbian Ministry of Education and Science (Serbia) — Council of Europe (EU)
- Connected components: 15 (6 isolated nodes, 9 linked clusters; cluster sizes 22, 10, 9, 9, 7, 5, 4, 4, 2)
  - isolated: Finnish Cultural Foundation (Finland)
  - isolated: Hellenic Federation of Enterprises (SEV) (Greece)
  - isolated: Confindustria – Diversity Management Working Group (Italy)
  - isolated: Business NZ – Cultural Capability Programme (New Zealand)
  - isolated: Norwegian Confederation of Trade Unions (LO) (Norway)
  - isolated: Serbian Chamber of Commerce – Diversity Council (Serbia)
- Text Analysis: 145 stop words, top 60 words per cloud
