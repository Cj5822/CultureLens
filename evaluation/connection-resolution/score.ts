// Scores the resolver variants on the frozen held-out suite (suite.json).
//
// Each reference has exactly one outcome per resolver:
//   TP  linked to the labelled target
//   FP  linked to any other entity (whether or not a target exists)
//   FN  left unresolved although a target exists
//   TN  left unresolved and no target exists
// precision = TP / (TP + FP); recall = TP / references with a target;
// accuracy = (TP + TN) / all references.
//
// Usage: npm run resolution
// Outputs: connection-resolution/results.{md,json} and figure.svg
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { loadWorkbooks, demoFiles } from '../lib/load'
import { groupedBarSvg } from '../lib/svg'
import { RESOLVERS } from './resolvers'
import type { Entity, Stakeholder } from '@/types/entities'

const DIR = path.resolve('connection-resolution')
const FROZEN_SHA256 = '0e6d474c0cd3e64a486f9a64f76db53b98c7d87430a28ab5fb663fadc534ba51'

// Hash with LF line endings, so a CRLF checkout on Windows gives the same hash.
const suiteText = readFileSync(path.join(DIR, 'suite.json'), 'utf8').replace(/\r\n/g, '\n')
const sha = createHash('sha256').update(suiteText).digest('hex')
if (sha !== FROZEN_SHA256) {
  console.error(`suite.json has changed since it was frozen (sha256 ${sha}). Refusing to score.`)
  process.exit(1)
}

interface Ref { id: string; source: string; text: string; target: string | null; category: string }
const suite = JSON.parse(suiteText) as { references: Ref[]; categories: Record<string, string>; fixtureEntities: { name: string; country: string }[] }

const { entities: loaded } = loadWorkbooks(demoFiles())
const fixtures: Entity[] = suite.fixtureEntities.map((f, i) => ({
  id: `STK-FIX-${String(i + 1).padStart(3, '0')}`, category: 'stakeholders', name: f.name, country: f.country,
  actorType: 'government', thematicFocus: [], geographicalScope: [], link: '', impactInfluence: 'advisory',
  connections: [], recommendedNextSteps: 'monitor', additionalRemarks: '', languages: [], equityAddressed: '',
  intendedAudience: '', itcApproach: '', relationToITC: '', functionalRole: '', description: '', relevanceToINTRACOMP: '',
  lat: 0, lng: 0,
} satisfies Stakeholder))
const entities = [...loaded.map((e) => ({ ...e, connections: [] as string[] })), ...fixtures]

const byName = (name: string): Entity => {
  const hits = entities.filter((e) => e.name === name)
  if (hits.length !== 1) throw new Error(`Suite names ${hits.length} entities called "${name}"`)
  return hits[0]
}
const nameOf = new Map(entities.map((e) => [e.id, e.name]))

type Outcome = 'TP' | 'FP' | 'FN' | 'TN'
const rows = suite.references.map((r) => {
  const source = byName(r.source)
  const targetId = r.target ? byName(r.target).id : null
  const outcomes: Record<string, { linked: string | null; outcome: Outcome }> = {}
  for (const res of RESOLVERS) {
    const linked = res.fn(r.text, source, entities)
    const outcome: Outcome = linked ? (linked === targetId ? 'TP' : 'FP') : (targetId ? 'FN' : 'TN')
    outcomes[res.key] = { linked: linked ? nameOf.get(linked) ?? linked : null, outcome }
  }
  return { ...r, outcomes }
})

const withTarget = rows.filter((r) => r.target).length
const summary = RESOLVERS.map((res) => {
  const c = { TP: 0, FP: 0, FN: 0, TN: 0 }
  for (const r of rows) c[r.outcomes[res.key].outcome]++
  return {
    key: res.key, label: res.label, ...c,
    precision: c.TP + c.FP ? c.TP / (c.TP + c.FP) : null,
    recall: c.TP / withTarget,
    accuracy: (c.TP + c.TN) / rows.length,
  }
})

const categories = Object.keys(suite.categories)
const perCategory = categories.map((cat) => {
  const rs = rows.filter((r) => r.category === cat)
  const correct = Object.fromEntries(RESOLVERS.map((res) => [res.key, rs.filter((r) => ['TP', 'TN'].includes(r.outcomes[res.key].outcome)).length]))
  return { category: cat, n: rs.length, shouldLink: rs.some((r) => r.target), correct }
})

const generatedAt = new Date().toISOString()
writeFileSync(path.join(DIR, 'results.json'), JSON.stringify({ generatedAt, suiteSha256: sha, summary, perCategory, references: rows }, null, 2))

const f2 = (x: number | null) => (x === null ? '–' : x.toFixed(2))
const md = [
  '# Held-out connection-resolution results',
  '',
  `Generated ${generatedAt} by \`npm run resolution\` on suite.json (sha256 ${sha.slice(0, 12)}…). ${rows.length} references: ${withTarget} with a true target, ${rows.length - withTarget} without.`,
  '',
  '| Resolver | TP | FP | FN | TN | Precision | Recall | Accuracy |',
  '|---|---:|---:|---:|---:|---:|---:|---:|',
  ...summary.map((s) => `| ${s.label} | ${s.TP} | ${s.FP} | ${s.FN} | ${s.TN} | ${f2(s.precision)} | ${f2(s.recall)} | ${f2(s.accuracy)} |`),
  '',
  '## Correct outcomes per category',
  '',
  `| Category | n | ${RESOLVERS.map((r) => r.key).join(' | ')} |`,
  `|---|---:|${RESOLVERS.map(() => '---:').join('|')}|`,
  ...perCategory.map((c) => `| ${c.category}${c.shouldLink ? '' : ' (should stay unresolved)'} | ${c.n} | ${RESOLVERS.map((r) => c.correct[r.key]).join(' | ')} |`),
  '',
  '## Every reference',
  '',
  '| ID | Category | Reference | Target | Implemented | Prototype |',
  '|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.id} | ${r.category} | ${r.text} | ${r.target ?? '—'} | ${r.outcomes.implemented.outcome}${r.outcomes.implemented.outcome === 'FP' ? ` → ${r.outcomes.implemented.linked}` : ''} | ${r.outcomes.prototype.outcome}${r.outcomes.prototype.outcome === 'FP' ? ` → ${r.outcomes.prototype.linked}` : ''} |`),
  '',
].join('\n')
writeFileSync(path.join(DIR, 'results.md'), md)

writeFileSync(path.join(DIR, 'figure.svg'), groupedBarSvg({
  words: perCategory.map((c) => `${c.category} (${c.n})`),
  groups: [
    { name: 'Implemented resolver', color: '#2a78d6', values: perCategory.map((c) => c.correct.implemented) },
    { name: 'Prototype refinement', color: '#eb6834', values: perCategory.map((c) => c.correct.prototype) },
  ],
  xLabel: 'References with the correct outcome',
  valueLabels: true,
}))
console.log(md)
