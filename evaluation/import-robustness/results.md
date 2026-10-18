# Import-robustness results

Generated 2026-10-17T13:09:28.686Z by `npm run robustness` (Node v22.22.0) against `frontend/src/utils/excelParser.ts`.

## Template variants

| Variant | Expected | Observed | Result |
|---|---|---|---|
| Current template (Intro sheet; stakeholder header on row 6, instrument header on row 5) | 4 stakeholders, 3 instruments, country on all rows, 1 warning (empty-name row) | As expected. 4 stakeholders, 3 instruments (7 entities); countries ["Germany"]; 1 warning(s): "Stakeholders row 9: skipped - "Name" is empty" | Pass |
| Country label only on Stakeholders sheet (Instruments "Country:" value blank) | Instruments inherit the country; all 7 entities "Germany" | As expected. 4 stakeholders, 3 instruments (7 entities); countries ["Germany"]; 1 warning(s): "Stakeholders row 9: skipped - "Name" is empty" | Pass |
| Sheet names in different case / singular ("STAKEHOLDER", "Instrument") | Both sheets located; same result as the current template | As expected. 4 stakeholders, 3 instruments (7 entities); countries ["Germany"]; 1 warning(s): "Stakeholders row 9: skipped - "Name" is empty" | Pass |
| Instruments sheet missing | Explicit error naming the missing sheet | Error: "Could not find an "Instruments" sheet in the workbook." | Pass |
| Stakeholder metadata block one row shorter (no spacer row; header on row 5) | Header row found; 4 stakeholders imported | 0 of 4 stakeholders imported; 4 warning(s): "Stakeholders row 7: skipped - "Name" is empty"; "Stakeholders row 8: skipped - "Name" is empty"; "Stakeholders row 9: skipped - "Name" is empty"; "Stakeholders row 10: skipped - "Name" is empty" | **Fail** |
| Legacy file: no Intro sheet, no metadata, headers on row 1 | All rows imported (4 + 3 entities) | 0 of 4 stakeholders imported; 0 of 3 instruments imported; 2 warning(s): "Stakeholders row 6: skipped - "Name" is empty"; "Instruments row 4: skipped - "Official name" is empty" | **Fail** |

## Field-level checks

| Check | Expected | Observed | Result |
|---|---|---|---|
| Mixed-case actor type ("Government", "ADMINISTRATION", "ngo") | government, administration, NGO | government, administration, NGO | Pass |
| Mixed-case impact and instrument type ("BINDING", "Highly Influential", "Law", "STRATEGY") | binding, highly influential, law, strategy | binding, highly influential, law, strategy | Pass |
| Multi-valued cells split on ";", "," and "/" | [Education, Migration]; [Migration, Inter- and Transcultural Competences]; [Culture, Education] | [Education, Migration]; [Migration, Inter- and Transcultural Competences]; [Culture, Education] | Pass |
| Row with empty name skipped with a warning | 1 warning mentioning "Name" | "Stakeholders row 9: skipped - "Name" is empty" | Pass |
| Connections split on ";" (cell with two references) | ["Federal Ministry for Learning (FML)", "Intercultural Schools Act"] | ["Federal Ministry for Learning (FML)","Intercultural Schools Act"] | Pass |
| Out-of-enumeration values ("Public administration", "very influential", "follow up", "regulation", "in progress") | Rows imported; a warning for each value replaced by a default | Imported as actorType=other, impact=advisory, nextSteps=monitor, instrumentType=other, status=development; 0 warning(s) | **Fail** |
