# Scalability benchmark results

Generated 2026-10-17T14:13:27.062Z by `npm run benchmark` on 2 × Intel(R) Xeon(R) Processor @ 2.10GHz (linux x64), Node v22.22.0.
Median of 7 repetitions after one warm-up; excludes DOM/SVG rendering.

| Entities | Connected | Edges | Resolution (ms) | Filtering (ms) | Graph build (ms) | Parallel sets (ms) | Word frequencies (ms) | Force tick (ms) | Ticks | Layout to convergence (ticks × tick) | Layout to convergence (measured) |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 50 | 18 | 23 | 0.31 | 0.01 | 0.01 | 0.20 | 0.68 | 0.16 | 244 | 0.04 s | 0.05 s |
| 250 | 88 | 131 | 2.14 | 0.06 | 0.03 | 0.88 | 2.56 | 0.91 | 244 | 0.22 s | 0.23 s |
| 500 | 171 | 300 | 7.26 | 0.01 | 0.06 | 1.05 | 3.17 | 2.23 | 244 | 0.54 s | 0.55 s |
| 1,000 | 379 | 665 | 28.3 | 0.03 | 0.04 | 1.19 | 5.38 | 5.76 | 244 | 1.4 s | 1.5 s |
| 2,500 | 883 | 1523 | 141 | 0.11 | 0.14 | 1.55 | 11.9 | 18.4 | 244 | 4.5 s | 5.0 s |
| 5,000 | 1807 | 3127 | 648 | 0.31 | 0.86 | 3.97 | 24.9 | 44.1 | 244 | 10.8 s | 11.9 s |

16.7 ms is the per-frame budget at 60 frames per second.
