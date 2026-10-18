# CultureLens evaluation tooling

Tools behind the technical and user evaluation in the CultureLens final report
(Chapters 3 and 5, Appendix A). Every TypeScript tool is bundled together with
the application's own modules from `../frontend/src`. The results therefore
always reflect the production parser, resolver, filters, parallel-sets
layout, word-frequency module and graph builder, and not a copy of them.

## Provenance

Each tool was run against the application as evaluated (commit `9e88a71`),
and the committed outputs in each folder are from those runs.
`connection-resolution/suite.json` was frozen, with its checksum recorded,
before any resolver was run on it.

## Setup

```bash
cd frontend && npm install      # the tools use the application's dependencies
cd ../evaluation && npm install # esbuild (+ optional PNG renderer)
pip install -r user-study/analysis/requirements.txt   # only for the response analysis
```

Requires Node.js 20+ and, for the analysis, Python 3.9+ with SciPy.

## Tools

| Tool | Report sections | Command | Output |
|---|---|---|---|
| Import-robustness harness: six template variants plus field-level checks, run through the production parser | 3.6, 5.1 (Table 7) | `npm run robustness` | `import-robustness/results.md`, `results.json`, `workbooks/*.xlsx` |
| Labelled connection-resolution suite (46 references), prototype resolver and scoring | 3.6, 5.2 (Table 8, Figure 6) | `npm run resolution` | `connection-resolution/results.md`, `.json`, `figure.svg` |
| Scalability benchmark: dataset generator plus timing of every pipeline stage and the force layout | 3.6, 5.4 (Table 9, Figure 7) | `npm run benchmark` | `scalability/results.md`, `.csv`, `.json`, `figure.svg` |
| Design-audit re-verification and measured effects | 3.6, 5.5 (Table 10) | `npm run audit-checks` | `design-audit/AUDIT.md`, `checks.md` |
| Dataset generator on its own, writing importable workbooks | 5.4 | `npm run generate-dataset -- 1000` | `scalability/datasets/1000/` |
| Answer key and dataset facts: Table 6 answers and the network facts quoted in Section 5.3 | 3.7, 5.3 (Table 6) | `npm run answer-key` | `user-study/answer-key/answer-key.md`, `.json` |
| Stimulus tool: RQ4 frequency tables, bar charts, C1–C3 task selection and answers, tokenisation check | 3.8, 4.7 (Figure 1) | `npm run stimuli` | `user-study/stimuli/output/<pair>/`, `user-study/form/Tasks.gs` |

`npm run benchmark -- --sizes 50,250 --reps 3` runs a quick subset, and
`npm run benchmark -- --replot` redraws the figure from `results.json`.
Benchmark timings depend on the machine; `results.md` records the CPU and the
Node version used.

## User-study results

The user evaluation was built and run in Google Forms, and the results in
report Sections 5.6 and 5.7 come from its responses, which are not
redistributed. `user-study/form/` and `user-study/analysis/` hold optional
helpers (an Apps Script that generates a version of the form, and a script that
summarises a response export). They were not used to produce the reported
results.

## Findings

- **Tokenisation of non-ASCII letters.** `extractWords()` in
  `frontend/src/utils/textFrequency.ts` treats any letter outside a–z as a
  separator. As a result, "Māori" is counted as "ori", "Länder" as "nder" and
  "Tapasā" as "tapas", in both the word clouds and the bar charts. In the
  demonstration data, "ori" (from Māori) occurs 11 times for New Zealand, the
  same count as "bicultural", so the Text Analysis task's New Zealand answer is
  a tie. The stimulus tool lists every affected word, and the analysis
  script counts answers that name Māori.
- **The prototype resolver.** On the labelled suite, the prototype
  refinement removed every false link (precision 1.00, up from 0.82), but
  recall fell from 0.82 to 0.59. Its word-boundary rule also rejects partial
  names ("Ka Hikitia", "Integreringsloven") and acronyms of three letters or
  fewer, or in mixed case ("DVV", "IMDi").
