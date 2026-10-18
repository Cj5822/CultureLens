# CultureLens

A web-based visual analytics framework for mapping and analysing intercultural
and transcultural competencies (ITC) across the INTRACOMP partner countries.
Partner workbooks are imported in the browser and explored through six
coordinated views: map, analytics dashboard, parallel sets, cluster analysis,
network graph and comparative word cloud.

This repository is the research compendium for the final report
*CultureLens: A Visual Analytics Framework for Mapping and Scaffolding
Intercultural and Transcultural Competencies* (University of Auckland, 2026).
The version cited in the report is the git tag `v1.0-report`.

## Layout

| Path | Contents |
|---|---|
| `frontend/src/` | The application (React, TypeScript, Vite) |
| `frontend/src/data/` | The eight demonstration workbooks used in the user evaluation |
| `frontend/tests/` | Unit and regression tests (`npm test`) |
| `evaluation/` | Tools and results behind every technical and user-evaluation result ([evaluation/README.md](evaluation/README.md)) |

## Running the application

```bash
cd frontend
npm install
npm run dev      # development server
npm run build    # production build (type-check + bundle)
npm test         # type-check the tests, then run them
```

## Reproducing the report

Run `npm install` once in `frontend/` and once in `evaluation/`, then run the
commands below from `evaluation/`. Each command writes its results next to
the script.

| Report item | Command | Output |
|---|---|---|
| Table 6 (task answers), Section 5.3 (network facts) | `npm run answer-key` | `user-study/answer-key/answer-key.md` |
| Figure 1 and RQ4 stimuli (Section 3.8) | `npm run stimuli` | `user-study/stimuli/output/` |
| Table 7 (import robustness) | `npm run robustness` | `import-robustness/results.md` |
| Table 8, Figure 6 | `npm run resolution` | `connection-resolution/results.md`, `figure.svg` |
| Table 9, Figure 7 (scalability) | `npm run benchmark` | `scalability/results.md`, `figure.svg` |
| Table 10 (design audit) | `npm run audit-checks` | `design-audit/AUDIT.md`, `checks.md` |
| Tables 11–13, SUS (Sections 5.6–5.7) | Google Forms responses | not redistributed |

The user evaluation was run in Google Forms, and its responses are not in
the repository (participants were promised aggregate reporting only). Consortium partner workbooks, including
the German extraction, are held by the INTRACOMP consortium and are not
redistributed.

## Authors

Caleb Jung and Lucas Jung, supervised by Associate Professor Burkhard Wunsche
and Associate Professor Nasser Giacaman.
