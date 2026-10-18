# Held-out connection-resolution results

Generated 2026-10-18T01:20:16.850Z by `npm run resolution` on suite.json (sha256 0e6d474c0cd3…). 46 references: 34 with a true target, 12 without.

| Resolver | TP | FP | FN | TN | Precision | Recall | Accuracy |
|---|---:|---:|---:|---:|---:|---:|---:|
| Original exact-ID matching | 2 | 0 | 32 | 12 | 1.00 | 0.06 | 0.30 |
| Implemented name-based resolver | 28 | 6 | 5 | 7 | 0.82 | 0.82 | 0.76 |
| Prototype: word-boundary + acronym rule | 20 | 0 | 14 | 12 | 1.00 | 0.59 | 0.70 |

## Correct outcomes per category

| Category | n | exact-id | implemented | prototype |
|---|---:|---:|---:|---:|
| exact | 4 | 0 | 4 | 4 |
| variant | 4 | 0 | 4 | 4 |
| annotated | 4 | 0 | 4 | 4 |
| acronym-long | 5 | 0 | 5 | 4 |
| acronym-short | 3 | 0 | 2 | 0 |
| partial-name | 5 | 0 | 5 | 0 |
| prose | 3 | 0 | 2 | 2 |
| abbreviation-not-in-name | 4 | 0 | 0 | 0 |
| generic (should stay unresolved) | 6 | 6 | 2 | 6 |
| duplicate-name (should stay unresolved) | 2 | 2 | 2 | 2 |
| not-in-dataset (should stay unresolved) | 4 | 4 | 3 | 4 |
| id | 2 | 2 | 2 | 2 |

## Every reference

| ID | Category | Reference | Target | Implemented | Prototype |
|---|---|---|---|---|---|
| R01 | exact | Diakonie Deutschland | Diakonie Deutschland | TP | TP |
| R02 | exact | Ministry of Education and Culture | Ministry of Education and Culture | TP | TP |
| R03 | exact | Group 484 | Group 484 | TP | TP |
| R04 | exact | Solidarity Now | Solidarity Now | TP | TP |
| R05 | variant | european commission - dg education and culture (dg eac) | European Commission – DG Education and Culture (DG EAC) | TP | TP |
| R06 | variant | Humboldt University Berlin - Institute for Intercultural Education | Humboldt University Berlin – Institute for Intercultural Education | TP | TP |
| R07 | variant | Te Puni Kokiri (Ministry for Maori Development) | Te Puni Kōkiri (Ministry for Māori Development) | TP | TP |
| R08 | variant | MUNICIPALITY OF MILAN - INTERCULTURAL POLICIES OFFICE | Municipality of Milan – Intercultural Policies Office | TP | TP |
| R09 | annotated | Bertelsmann Stiftung (s. stakeholder sheet) | Bertelsmann Stiftung | TP | TP |
| R10 | annotated | Greek Council for Refugees – legal aid partner | Greek Council for Refugees | TP | TP |
| R11 | annotated | Norwegian Refugee Council (NRC), see stakeholder list | Norwegian Refugee Council | TP | TP |
| R12 | annotated | Erasmus+ Programme 2021–2027 (main EU funding line) | Erasmus+ Programme 2021–2027 | TP | TP |
| R13 | acronym-long | BAMF | Federal Office for Migration and Refugees (BAMF) | TP | TP |
| R14 | acronym-long | MIUR | Italian Ministry of Education and Research (MIUR) | TP | TP |
| R15 | acronym-long | IMDi | Norwegian Centre for Multicultural Value Development (IMDi) | TP | FN |
| R16 | acronym-long | ENAR | European Network Against Racism (ENAR) | TP | TP |
| R17 | acronym-long | ARCI | ARCI (Associazione Ricreativa e Culturale Italiana) | TP | TP |
| R18 | acronym-short | DVV | Deutscher Volkshochschul-Verband (DVV) | TP | FN |
| R19 | acronym-short | ZEP | Zones of Educational Priority (ZEP) Programme | TP | FN |
| R20 | acronym-short | LO | Norwegian Confederation of Trade Unions (LO) | FP → Aristotle University of Thessaloniki – Intercultural Education Lab | FN |
| R21 | partial-name | Te Tāhuhu o te Mātauranga | Ministry of Education (Te Tāhuhu o te Mātauranga) | TP | FN |
| R22 | partial-name | Ka Hikitia | Ka Hikitia – Māori Education Strategy | TP | FN |
| R23 | partial-name | Integreringsloven | Norwegian Integration Act (Integreringsloven) | TP | FN |
| R24 | partial-name | Human Rights Commission | Human Rights Commission NZ | TP | FN |
| R25 | prose | implemented through the Finnish National Agency for Education and municipalities | Finnish National Agency for Education | TP | TP |
| R26 | prose | other instruments developed by the Federal Office for Migration and Refugees | Federal Office for Migration and Refugees (BAMF) | FN | FN |
| R27 | prose | monitored together with the Serbian Commissariat for Refugees and Migration | Serbian Commissariat for Refugees and Migration | TP | TP |
| R28 | abbreviation-not-in-name | OKM | Ministry of Education and Culture | FN | FN |
| R29 | abbreviation-not-in-name | Utdanningsdirektoratet | Norwegian Directorate for Education and Training | FN | FN |
| R30 | abbreviation-not-in-name | AGG | General Act on Equal Treatment (Allgemeines Gleichbehandlungsgesetz) | FN | FN |
| R31 | abbreviation-not-in-name | Opetushallitus | Finnish National Agency for Education | FN | FN |
| R46 | partial-name | DG EAC | European Commission – DG Education and Culture (DG EAC) | TP | FN |
| R32 | generic | Education | — | FP → EU Strategic Framework for European Cooperation in Education and Training (ET2030) | TN |
| R33 | generic | Migration | — | FP → Serbian Commissariat for Refugees and Migration | TN |
| R34 | generic | Research | — | FP → Federal Ministry of Education and Research (BMBF) | TN |
| R35 | generic | local schools | — | TN | TN |
| R36 | generic | civil society organisations | — | TN | TN |
| R37 | generic | EU | — | FP → EU Strategic Framework for European Cooperation in Education and Training (ET2030) | TN |
| R38 | duplicate-name | Ministry of Education | — | TN | TN |
| R39 | duplicate-name | ministry of education | — | TN | TN |
| R40 | not-in-dataset | KMK (s. stakeholder sheet) | — | TN | TN |
| R41 | not-in-dataset | UNESCO | — | TN | TN |
| R42 | not-in-dataset | OECD PISA team | — | TN | TN |
| R43 | not-in-dataset | UN | — | FP → Interkulturelle Öffnung (Intercultural Opening) Guideline for Public Administration | TN |
| R44 | id | STK-IMP-022 | Federal Office for Migration and Refugees (BAMF) | TP | TP |
| R45 | id | INS-IMP-007 | Council Recommendation on Key Competences for Lifelong Learning | TP | TP |
