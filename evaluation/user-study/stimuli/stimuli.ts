// Stimulus generation tool for the word cloud vs bar chart comparison
// (RQ4; report Sections 3.8 and 4.7).
//
// Uses the application's own parser and word-frequency module
// (frontend/src/utils/textFrequency.ts), so the bar charts and answer keys
// are built from exactly the counts behind the Text Analysis word clouds.
//
// For each country pair it writes, to user-study/stimuli/output/<pair>/:
//   frequencies.csv   count of every word in either country's word cloud
//                     (top 60 per country), for both countries
//   bar-chart.svg     grouped horizontal bar chart of the 20 most frequent
//                     words across the pair (by combined count), both
//                     countries on one shared axis (.png too if
//                     @resvg/resvg-js is installed)
//   tasks.md / .json  automatically selected C1-C3 tasks with answers,
//                     every eligible alternative, and quality flags
//
// Task rules (Section 3.8):
//   C1  most frequent word for country A, ignoring "itc"; flagged if the
//       top two words differ by less than 5% (or tie)
//   C2  a word in both countries' clouds and in the bar chart whose counts
//       differ by at least 30%; answer is the country with more
//   C3  two words in country B's top 15 and in the bar chart whose counts
//       differ by 10 to 35%; answer is the more frequent word
// "Difference" is (larger - smaller) / larger.
//
// Usage: npm run stimuli [-- "Germany:New Zealand" "Finland:Italy"]
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { loadWorkbooks, demoFiles } from '../../lib/load'
import { groupedBarSvg } from '../../lib/svg'
import { buildFrequency, buildFreqWords, extractWords, TEXT_FIELDS, MAX_WORDS_PER_CLOUD } from '@/utils/textFrequency'
import { filterEntities } from '@/utils/filterEntities'
import { DEFAULT_FILTERS } from '@/types/filters'

const OUT = path.resolve('user-study', 'stimuli', 'output')
const BAR_WORDS = 20
const C3_TOP = 15
const COLOR_A = '#2563eb' // Text Analysis view colours (TextAnalysis.tsx)
const COLOR_B = '#ea580c'

const pairArgs = process.argv.slice(2).filter((a) => a.includes(':'))
const PAIRS: [string, string][] = pairArgs.length
  ? pairArgs.map((p) => p.split(':') as [string, string])
  : [['Germany', 'New Zealand'], ['Finland', 'Italy']]

const { entities } = loadWorkbooks(demoFiles())
const diff = (a: number, b: number) => (Math.max(a, b) === 0 ? 0 : (Math.max(a, b) - Math.min(a, b)) / Math.max(a, b))
const pct = (x: number) => `${Math.round(x * 100)}%`

let pngRenderer: ((svg: string) => Buffer) | null = null
try {
  const { Resvg } = await import('@resvg/resvg-js')
  pngRenderer = (svg: string) => Buffer.from(new Resvg(svg, { fitTo: { mode: 'zoom', value: 2 }, font: { loadSystemFonts: true } }).render().asPng())
} catch {
  console.warn('@resvg/resvg-js not installed: writing SVG only (run `npm install` in evaluation/ for PNG output).')
}

/** Words in the raw text that contain letters outside a-z. extractWords()
 *  treats those letters as separators, so e.g. "Māori" is counted as "ori". */
function tokenisationIssues(country: string): { original: string; countedAs: string[]; occurrences: number }[] {
  const found = new Map<string, number>()
  for (const e of filterEntities(entities, { ...DEFAULT_FILTERS, countries: [country] })) {
    const seen = new Set<string>()
    for (const f of TEXT_FIELDS) {
      const v = (e as unknown as Record<string, unknown>)[f]
      if (typeof v !== 'string' || !v || seen.has(v)) continue
      seen.add(v)
      for (const w of v.split(/[\s,.;:()"“”!?]+/)) {
        if (/[^\x00-\x7f]/.test(w) && /\p{L}/u.test(w) && /[^\x00-\x7f]/.test(w.replace(/[–—‘’]/g, ''))) {
          found.set(w, (found.get(w) ?? 0) + 1)
        }
      }
    }
  }
  return [...found.entries()]
    .map(([original, occurrences]) => ({ original, countedAs: extractWords(original), occurrences }))
    .sort((a, b) => b.occurrences - a.occurrences)
}

const summary: Record<string, unknown> = {}

for (const [A, B] of PAIRS) {
  const slug = `${A}-vs-${B}`.toLowerCase().replace(/\s+/g, '-')
  const dir = path.join(OUT, slug)
  mkdirSync(dir, { recursive: true })

  const freqA = buildFrequency(A, entities)
  const freqB = buildFrequency(B, entities)
  const cloudA = buildFreqWords(A, entities) // what the word cloud shows for A
  const cloudB = buildFreqWords(B, entities)
  const inCloudA = new Set(cloudA.map((w) => w.text))
  const inCloudB = new Set(cloudB.map((w) => w.text))
  const cA = (w: string) => freqA.get(w) ?? 0
  const cB = (w: string) => freqB.get(w) ?? 0

  // Frequency table: union of both clouds.
  const union = [...new Set([...inCloudA, ...inCloudB])]
    .map((w) => ({ word: w, a: cA(w), b: cB(w) }))
    .sort((x, y) => y.a + y.b - (x.a + x.b) || x.word.localeCompare(y.word))
  writeFileSync(path.join(dir, 'frequencies.csv'),
    [`word,${A},${B},combined,in_cloud_${A.replace(/\s+/g, '_')},in_cloud_${B.replace(/\s+/g, '_')}`,
      ...union.map((r) => `${r.word},${r.a},${r.b},${r.a + r.b},${inCloudA.has(r.word)},${inCloudB.has(r.word)}`)].join('\n') + '\n')

  // Bar chart: 20 most frequent words across the pair.
  const bars = union.slice(0, BAR_WORDS)
  const inBars = new Set(bars.map((r) => r.word))
  const svg = groupedBarSvg({
    words: bars.map((r) => r.word),
    groups: [{ name: A, color: COLOR_A, values: bars.map((r) => r.a) }, { name: B, color: COLOR_B, values: bars.map((r) => r.b) }],
  })
  writeFileSync(path.join(dir, 'bar-chart.svg'), svg)
  if (pngRenderer) writeFileSync(path.join(dir, 'bar-chart.png'), pngRenderer(svg))

  // C1: most frequent word for A, ignoring "itc".
  const rankedA = cloudA.filter((w) => w.text !== 'itc')
  const c1 = {
    question: `Ignoring 'itc', which word appears most often for ${A}?`,
    answer: rankedA[0]?.text,
    counts: rankedA.slice(0, 3).map((w) => `${w.text} ${w.count}`),
    flags: [] as string[],
  }
  if (rankedA[1] && diff(rankedA[0].count, rankedA[1].count) < 0.05)
    c1.flags.push(rankedA[0].count === rankedA[1].count
      ? `TIE: "${rankedA[0].text}" and "${rankedA[1].text}" both occur ${rankedA[0].count} times`
      : `top two differ by only ${pct(diff(rankedA[0].count, rankedA[1].count))}`)
  if (c1.answer && !inBars.has(c1.answer)) c1.flags.push('answer not shown in the bar chart')

  // C2: shared word, >= 30% difference, visible in both formats.
  const c2Candidates = bars
    .filter((r) => r.word !== 'itc' && inCloudA.has(r.word) && inCloudB.has(r.word) && diff(r.a, r.b) >= 0.3)
    .map((r) => ({ word: r.word, a: r.a, b: r.b, difference: pct(diff(r.a, r.b)) }))
  const c2w = c2Candidates[0]
  const c2 = c2w ? {
    question: `Is the word '${c2w.word}' used more often by ${A} or by ${B}?`,
    options: [A, B, 'About the same'],
    answer: c2w.a > c2w.b ? A : B,
    counts: `${A} ${c2w.a}, ${B} ${c2w.b} (${c2w.difference})`,
    alternatives: c2Candidates.slice(1),
  } : { question: null, answer: null, flags: ['no eligible word'], alternatives: [] }

  // C3: two of B's top-15 words, 10-35% apart, both in the bar chart.
  const topB = cloudB.filter((w) => w.text !== 'itc').slice(0, C3_TOP).filter((w) => inBars.has(w.text))
  const c3Candidates: { x: string; y: string; cx: number; cy: number; difference: string }[] = []
  for (let i = 0; i < topB.length; i++) for (let j = i + 1; j < topB.length; j++) {
    const d = diff(topB[i].count, topB[j].count)
    if (d >= 0.1 && d <= 0.35) c3Candidates.push({ x: topB[i].text, y: topB[j].text, cx: topB[i].count, cy: topB[j].count, difference: pct(d) })
  }
  const c3p = c3Candidates[0]
  const c3 = c3p ? {
    question: `For ${B}, which appears more often: '${c3p.x}' or '${c3p.y}'?`,
    options: [c3p.x, c3p.y, 'About the same'],
    answer: c3p.cx > c3p.cy ? c3p.x : c3p.y,
    counts: `${c3p.x} ${c3p.cx}, ${c3p.y} ${c3p.cy} (${c3p.difference})`,
    alternatives: c3Candidates.slice(1, 10),
  } : { question: null, answer: null, flags: ['no eligible pair'], alternatives: [] }

  const tokenIssues = { [A]: tokenisationIssues(A), [B]: tokenisationIssues(B) }
  const result = { pair: [A, B], barWords: bars.map((r) => r.word), c1, c2, c3, tokenisationIssues: tokenIssues }
  summary[slug] = result
  writeFileSync(path.join(dir, 'tasks.json'), JSON.stringify(result, null, 2))

  const md = [
    `# RQ4 stimuli: ${A} vs ${B}`,
    '',
    `Word clouds show the top ${MAX_WORDS_PER_CLOUD} words per country; the bar chart shows the ${BAR_WORDS} most frequent words across the pair.`,
    '',
    '| Task | Question | Answer | Counts | Flags |',
    '|---|---|---|---|---|',
    `| C1 | ${c1.question} | ${c1.answer} | ${c1.counts.join(', ')} | ${c1.flags.join('; ') || '—'} |`,
    `| C2 | ${c2.question ?? '—'} | ${c2.answer ?? '—'} | ${'counts' in c2 ? c2.counts : '—'} | ${'flags' in c2 ? c2.flags.join('; ') : '—'} |`,
    `| C3 | ${c3.question ?? '—'} | ${c3.answer ?? '—'} | ${'counts' in c3 ? c3.counts : '—'} | ${'flags' in c3 ? c3.flags.join('; ') : '—'} |`,
    '',
    `Other eligible C2 words: ${c2.alternatives.map((a) => `${a.word} (${a.a} vs ${a.b})`).join(', ') || 'none'}`,
    '',
    `Other eligible C3 pairs: ${c3.alternatives.map((a) => `${a.x}/${a.y} (${a.cx} vs ${a.cy})`).join(', ') || 'none'}`,
    '',
    '## Tokenisation check',
    '',
    'Words containing letters outside a–z are split by the word-frequency module, so they appear in both formats under the fragment shown.',
    '',
    ...Object.entries(tokenIssues).flatMap(([c, xs]) => xs.length
      ? xs.map((x) => `- ${c}: "${x.original}" (${x.occurrences}×) counted as ${x.countedAs.length ? x.countedAs.map((w) => `"${w}"`).join(' + ') : '(nothing)'}`)
      : [`- ${c}: none`]),
    '',
  ].join('\n')
  writeFileSync(path.join(dir, 'tasks.md'), md)
  console.log(md)
}

writeFileSync(path.join(OUT, 'answer-key.json'), JSON.stringify(summary, null, 2))

// Tasks.gs for the form generator (user-study/form/Code.gs): pair 1 is the
// first pair given, pair 2 the second.
type TaskSet = { pair: string[]; c1: { question: string; answer?: string }; c2: { question: string | null; options?: string[]; answer: string | null }; c3: { question: string | null; options?: string[]; answer: string | null } }
const sets = Object.values(summary) as TaskSet[]
const formTasks: Record<string, unknown> = {}
sets.slice(0, 2).forEach((s, i) => {
  formTasks[`P${i + 1}`] = {
    countries: s.pair,
    c1: { question: s.c1.question, answer: s.c1.answer },
    c2: { question: s.c2.question, options: s.c2.options ?? [], answer: s.c2.answer },
    c3: { question: s.c3.question, options: s.c3.options ?? [], answer: s.c3.answer },
  }
})
writeFileSync(path.resolve('user-study', 'form', 'Tasks.gs'),
  `// Generated by \`npm run stimuli\` on ${new Date().toISOString()}. Do not edit by hand.\n` +
  `// RQ4 tasks for the form generator (Code.gs); answers are included for reference only.\n` +
  `var RQ4_TASKS = ${JSON.stringify(formTasks, null, 2)};\n`)
