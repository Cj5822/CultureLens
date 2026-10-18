// Scalability benchmark (report Sections 3.6 and 5.4).
//
// For each dataset size, a synthetic dataset (generate.ts) is passed through
// every data-processing stage the application runs, timing each stage with
// the application's own functions:
//
//   Resolution     resolveConnections(all entities)       (DataContext)
//   Filtering      filterEntities(..., typical filter)    (FilterContext)
//   Graph build    buildGraphData(filtered)               (Network Graph)
//   Parallel sets  computeParallelSetsLayout(default 4 dimensions)
//   Word freqs     buildFreqWords for two countries       (Text Analysis)
//   Force layout   d3-force configured exactly as RelationshipGraph.tsx
//                  (link distance 90, charge -280, collide r+6,
//                  alphaDecay 0.028, velocityDecay 0.4), ticked manually
//                  until alpha < alphaMin, as the browser timer would.
//                  With alphaDecay 0.028 this always takes 244 ticks.
//
// Layout to convergence is reported two ways: calculated as ticks x median
// tick time (the figure the report uses), and measured as the median wall
// time of complete simulations.
//
// Each data stage is run once as a warm-up and then `reps` times; the median
// is reported. Force-layout figures are the median time per tick and the
// median total time to convergence over `reps` complete simulations.
// DOM/SVG rendering is not included, so all figures are lower bounds on the
// in-browser cost.
//
// Usage: npm run benchmark [-- --sizes 50,250,500 --reps 7]
//        npm run benchmark -- --replot   (redraw figure.svg from results.json)
// Outputs: scalability/results.{json,csv,md} and scalability/figure.svg
import { readFileSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { performance } from 'node:perf_hooks'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide, type SimulationNodeDatum } from 'd3-force'
import { generateDataset } from './generate'
import { resolveConnections } from '@/utils/resolveConnections'
import { filterEntities } from '@/utils/filterEntities'
import { DEFAULT_FILTERS, type EntityFilters } from '@/types/filters'
import { buildGraphData } from '@/utils/graph/buildGraphData'
import { computeParallelSetsLayout, PS_CANDIDATE_DIMENSIONS, PS_DEFAULT_DIMENSION_KEYS } from '@/utils/analytics/parallelSets'
import { buildFreqWords } from '@/utils/textFrequency'
import { IMPACT_RADIUS } from '@/components/graph/relationshipGraphConstants'
import type { GraphNode } from '@/types/graph'
import { lineChartSvg } from '../lib/svg'

const OUT = path.resolve('scalability')

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback
}
const SIZES = arg('sizes', '50,250,500,1000,2500,5000').split(',').map(Number)
const REPS = Number(arg('reps', '7'))

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function time(fn: () => unknown, reps: number): number {
  fn() // warm-up
  const ts: number[] = []
  for (let i = 0; i < reps; i++) {
    const t0 = performance.now()
    fn()
    ts.push(performance.now() - t0)
  }
  return median(ts)
}

/** A filter state a user might plausibly set: two impact levels and two themes. */
const TYPICAL_FILTER: EntityFilters = {
  ...DEFAULT_FILTERS,
  impactInfluence: ['binding', 'highly influential'],
  thematicFocus: ['Education', 'Migration'],
}

const PS_DIMS = PS_DEFAULT_DIMENSION_KEYS.map((k) => PS_CANDIDATE_DIMENSIONS.find((d) => d.key === k)!)

type SimNode = GraphNode & SimulationNodeDatum

function runForce(nodes: GraphNode[], edges: { source: string; target: string }[]) {
  const simNodes: SimNode[] = nodes.map((n) => ({ ...n }))
  const simEdges = edges.map((e) => ({ ...e }))
  const sim = forceSimulation<SimNode>(simNodes)
    .force('link', forceLink<SimNode, (typeof simEdges)[number] & { source: string | SimNode; target: string | SimNode }>(simEdges).id((d) => d.id).distance(90))
    .force('charge', forceManyBody<SimNode>().strength(-280))
    .force('center', forceCenter(500, 350))
    .force('collision', forceCollide<SimNode>().radius((d) => IMPACT_RADIUS[d.impactInfluence] + 6))
    .alphaDecay(0.028)
    .velocityDecay(0.4)
    .stop()
  const tickTimes: number[] = []
  const t0 = performance.now()
  while (sim.alpha() >= sim.alphaMin()) {
    const a = performance.now()
    sim.tick()
    tickTimes.push(performance.now() - a)
  }
  return { total: performance.now() - t0, ticks: tickTimes.length, tickTimes }
}

interface Row {
  entities: number
  connectedEntities: number
  references: number
  edges: number
  resolutionMs: number
  filteringMs: number
  graphBuildMs: number
  parallelSetsMs: number
  wordFrequenciesMs: number
  forceTickMs: number
  forceTicks: number
  /** ticks x median tick time (as reported) */
  layoutToConvergenceS: number
  /** median wall time of complete simulations */
  layoutToConvergenceMeasuredS: number
}

const REPLOT = process.argv.includes('--replot')
const rows: Row[] = REPLOT ? JSON.parse(readFileSync(path.join(OUT, 'results.json'), 'utf8')).rows : []
for (const n of REPLOT ? [] : SIZES) {
  const { entities: raw, connected, references } = generateDataset(n)
  const resolved = resolveConnections(raw)
  const filtered = filterEntities(resolved, TYPICAL_FILTER)
  const graph = buildGraphData(resolved)

  const resolutionMs = time(() => resolveConnections(raw), REPS)
  const filteringMs = time(() => filterEntities(resolved, TYPICAL_FILTER), REPS)
  const graphBuildMs = time(() => buildGraphData(filtered), REPS)
  const parallelSetsMs = time(() => computeParallelSetsLayout(resolved, PS_DIMS), REPS)
  const wordFrequenciesMs = time(() => { buildFreqWords('Germany', resolved); buildFreqWords('New Zealand', resolved) }, REPS)

  // Force layout on the full (unfiltered) graph, as shown on first load.
  runForce(graph.nodes, graph.edges as { source: string; target: string }[]) // warm-up
  const runs = Array.from({ length: REPS }, () => runForce(graph.nodes, graph.edges as { source: string; target: string }[]))
  const row: Row = {
    entities: n,
    connectedEntities: connected,
    references,
    edges: graph.edges.length,
    resolutionMs, filteringMs, graphBuildMs, parallelSetsMs, wordFrequenciesMs,
    forceTickMs: median(runs.flatMap((r) => r.tickTimes)),
    forceTicks: runs[0].ticks,
    layoutToConvergenceS: (runs[0].ticks * median(runs.flatMap((r) => r.tickTimes))) / 1000,
    layoutToConvergenceMeasuredS: median(runs.map((r) => r.total)) / 1000,
  }
  rows.push(row)
  console.log(`n=${n}: ${JSON.stringify(row)}`)
}

// ─── Output ─────────────────────────────────────────────────────────────────

const cpu = os.cpus()
const machine = `${cpu.length} × ${cpu[0]?.model.trim()} (${os.platform()} ${os.arch()}), Node ${process.version}`
const generatedAt = new Date().toISOString()
if (!REPLOT) writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ generatedAt, machine, reps: REPS, filter: TYPICAL_FILTER, rows }, null, 2))

const cols = Object.keys(rows[0]) as (keyof Row)[]
if (!REPLOT) writeFileSync(path.join(OUT, 'results.csv'), [cols.join(','), ...rows.map((r) => cols.map((c) => r[c]).join(','))].join('\n') + '\n')

const sec = (x: number) => `${x < 1 ? x.toFixed(2) : x.toFixed(1)} s`
const f = (x: number) => (x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2))
const md = [
  '# Scalability benchmark results',
  '',
  `Generated ${generatedAt} by \`npm run benchmark\` on ${machine}.`,
  `Median of ${REPS} repetitions after one warm-up; excludes DOM/SVG rendering.`,
  '',
  '| Entities | Connected | Edges | Resolution (ms) | Filtering (ms) | Graph build (ms) | Parallel sets (ms) | Word frequencies (ms) | Force tick (ms) | Ticks | Layout to convergence (ticks × tick) | Layout to convergence (measured) |',
  '|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...rows.map((r) => `| ${r.entities.toLocaleString('en')} | ${r.connectedEntities} | ${r.edges} | ${f(r.resolutionMs)} | ${f(r.filteringMs)} | ${f(r.graphBuildMs)} | ${f(r.parallelSetsMs)} | ${f(r.wordFrequenciesMs)} | ${f(r.forceTickMs)} | ${r.forceTicks} | ${sec(r.layoutToConvergenceS)} | ${sec(r.layoutToConvergenceMeasuredS)} |`),
  '',
  '16.7 ms is the per-frame budget at 60 frames per second.',
  '',
].join('\n')
if (!REPLOT) writeFileSync(path.join(OUT, 'results.md'), md)

writeFileSync(path.join(OUT, 'figure.svg'), lineChartSvg({
  panels: [
    {
      title: '(a) Data-pipeline stages',
      series: [
        { name: 'Resolution', values: rows.map((r) => r.resolutionMs) },
        { name: 'Filtering', values: rows.map((r) => r.filteringMs) },
        { name: 'Graph build', values: rows.map((r) => r.graphBuildMs) },
        { name: 'Parallel sets', values: rows.map((r) => r.parallelSetsMs) },
        { name: 'Word frequencies', values: rows.map((r) => r.wordFrequenciesMs) },
      ],
    },
    { title: '(b) Force-directed layout: time per tick', series: [{ name: 'Time per tick', values: rows.map((r) => r.forceTickMs), color: '#6250d6' }] },
  ],
  x: rows.map((r) => r.entities),
  xLabel: 'Entities',
  yLabel: 'Median time (ms)',
  budgetMs: 16.7,
}))
console.log(REPLOT ? 'figure.svg redrawn from results.json' : md)
