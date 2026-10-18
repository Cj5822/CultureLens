// Answer key for the per-view user-evaluation tasks (report Table 4) and the
// facts about the demonstration dataset quoted in Section 5.3.
//
// Every answer is computed with the same functions the corresponding view
// uses, on the eight demonstration workbooks loaded exactly as the
// application loads them (see lib/load.ts).
//
// Usage: npm run answer-key [-- <workbook.xlsx> ...]
// Outputs: user-study/answer-key/answer-key.json and answer-key.md
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { loadWorkbooks, demoFiles } from '../../lib/load'
import { filterEntities } from '@/utils/filterEntities'
import { DEFAULT_FILTERS } from '@/types/filters'
import { groupByActorType, groupByCountry } from '@/utils/analytics/grouping'
import { computeParallelSetsLayout, PS_CANDIDATE_DIMENSIONS } from '@/utils/analytics/parallelSets'
import { buildGraphData } from '@/utils/graph/buildGraphData'
import { buildFreqWords, STOP_WORDS, MAX_WORDS_PER_CLOUD } from '@/utils/textFrequency'
import type { Stakeholder } from '@/types/entities'

const OUT = path.resolve('user-study', 'answer-key')
const files = process.argv.slice(2).length ? process.argv.slice(2).map((f) => path.resolve(f)) : demoFiles()
const data = loadWorkbooks(files)
const { entities, raw } = data

// ─── Task answers ───────────────────────────────────────────────────────────

// Map View: filter impact = "highly influential", category = stakeholders, then
// compare the per-country entry counts the map tooltip shows.
const hiStakeholders = filterEntities(entities, { ...DEFAULT_FILTERS, categories: ['stakeholders'], impactInfluence: ['highly influential'] })
const hiByCountry = groupByCountry(hiStakeholders).map((g) => ({ country: g.label, count: g.count }))
const hiMax = Math.max(...hiByCountry.map((c) => c.count))
const mapAnswer = { byCountry: hiByCountry, leaders: hiByCountry.filter((c) => c.count === hiMax), count: hiMax }

// Analytics: implementation-status donut, segment "implementation".
const instruments = filterEntities(entities, { ...DEFAULT_FILTERS, categories: ['instruments'] })
const implementationCount = instruments.filter((e) => e.category === 'instruments' && e.implementationStatus === 'implementation').length

// Parallel Sets: columns Type and Impact/Influence, ribbon law -> binding.
const dims = ['type', 'impactInfluence'].map((k) => PS_CANDIDATE_DIMENSIONS.find((d) => d.key === k)!)
const ps = computeParallelSetsLayout(entities, dims)
const lawBinding = ps.ribbons.filter((r) => r.sourceValue === 'law' && r.targetValue === 'binding').reduce((s, r) => s + r.count, 0)

// Cluster Analysis: group by actor type, "administration" card.
const stakeholders = entities.filter((e): e is Stakeholder => e.category === 'stakeholders')
const adminCluster = groupByActorType(stakeholders).find((g) => g.label === 'administration')?.count ?? 0

// Network Graph: shortest path BMBF -> Diakonie Deutschland in the resolved graph.
const graph = buildGraphData(entities)
const adj = new Map<string, Set<string>>()
for (const n of graph.nodes) adj.set(n.id, new Set())
for (const e of graph.edges) {
  adj.get(e.source as string)!.add(e.target as string)
  adj.get(e.target as string)!.add(e.source as string)
}
const nameOf = new Map(entities.map((e) => [e.id, e.name]))
const findOne = (re: RegExp) => entities.filter((e) => re.test(e.name))
function shortestPath(from: string, to: string): string[] | null {
  const prev = new Map<string, string | null>([[from, null]])
  const queue = [from]
  while (queue.length) {
    const cur = queue.shift()!
    if (cur === to) break
    for (const nb of adj.get(cur) ?? []) {
      if (!prev.has(nb)) { prev.set(nb, cur); queue.push(nb) }
    }
  }
  if (!prev.has(to)) return null
  const pathIds: string[] = []
  for (let c: string | null = to; c; c = prev.get(c) ?? null) pathIds.unshift(c)
  return pathIds
}
const bmbf = findOne(/\bBMBF\b/)
const diakonie = findOne(/^Diakonie Deutschland\b/i)
const networkPath = bmbf.length === 1 && diakonie.length === 1 ? shortestPath(bmbf[0].id, diakonie[0].id) : null
const networkAnswer = {
  from: bmbf.map((e) => e.name), to: diakonie.map((e) => e.name),
  steps: networkPath ? networkPath.length - 1 : null,
  path: networkPath?.map((id) => nameOf.get(id)) ?? null,
}

// Text Analysis: largest word per country, ignoring "itc".
function topWord(country: string) {
  const words = buildFreqWords(country, entities).filter((w) => w.text !== 'itc')
  return { country, top: words.slice(0, 5) }
}
const textAnswer = [topWord('Germany'), topWord('New Zealand')]

// ─── Dataset facts (Section 5.3) ────────────────────────────────────────────

const perCountry = groupByCountry(entities).map((g) => ({
  country: g.label,
  stakeholders: g.entries.filter((e) => e.category === 'stakeholders').length,
  instruments: g.entries.filter((e) => e.category === 'instruments').length,
}))
const declaring = raw.filter((e) => e.connections.length > 0).length
const rawReferences = raw.reduce((s, e) => s + e.connections.length, 0)
const resolvedReferences = entities.reduce((s, e) => s + e.connections.length, 0)
const countryOf = new Map(entities.map((e) => [e.id, e.country]))
const crossCountryEdges = graph.edges.filter((e) => countryOf.get(e.source as string) !== countryOf.get(e.target as string))

// Connected components
const seen = new Set<string>()
const components: string[][] = []
for (const n of graph.nodes) {
  if (seen.has(n.id)) continue
  const comp: string[] = []
  const stack = [n.id]
  seen.add(n.id)
  while (stack.length) {
    const cur = stack.pop()!
    comp.push(cur)
    for (const nb of adj.get(cur) ?? []) if (!seen.has(nb)) { seen.add(nb); stack.push(nb) }
  }
  components.push(comp)
}
const isolated = components.filter((c) => c.length === 1)
const linked = components.filter((c) => c.length > 1).sort((a, b) => b.length - a.length)

const facts = {
  files: files.map((f) => path.basename(f)),
  entities: entities.length,
  stakeholders: stakeholders.length,
  instruments: instruments.length,
  parseWarnings: data.batches.reduce((s, b) => s + b.result.warnings.length, 0),
  perCountry,
  entitiesDeclaringConnections: declaring,
  rawReferences,
  resolvedReferences,
  unresolvedReferences: rawReferences - resolvedReferences,
  edges: graph.edges.length,
  crossCountryEdges: crossCountryEdges.map((e) => `${nameOf.get(e.source as string)} (${countryOf.get(e.source as string)}) — ${nameOf.get(e.target as string)} (${countryOf.get(e.target as string)})`),
  components: components.length,
  isolatedNodes: isolated.map((c) => `${nameOf.get(c[0])} (${countryOf.get(c[0])})`),
  linkedClusters: linked.length,
  linkedClusterSizes: linked.map((c) => c.length),
  textAnalysis: { stopWords: STOP_WORDS.size, wordsPerCloud: MAX_WORDS_PER_CLOUD },
}

const answers = {
  map: mapAnswer,
  analyticsImplementation: implementationCount,
  parallelSetsLawBinding: lawBinding,
  clusterAdministration: adminCluster,
  network: networkAnswer,
  text: textAnswer,
}

const generatedAt = new Date().toISOString()
writeFileSync(path.join(OUT, 'answer-key.json'), JSON.stringify({ generatedAt, answers, facts }, null, 2))

const md = [
  '# Answer key and dataset facts',
  '',
  `Generated ${generatedAt} by \`npm run answer-key\` from ${files.length} workbook(s).`,
  '',
  '## Per-view tasks (report Table 4)',
  '',
  '| View | Task | Answer |',
  '|---|---|---|',
  `| Map View | Which country has the most "highly influential" stakeholders, and how many? | ${mapAnswer.leaders.map((l) => l.country).join(' / ')}, ${mapAnswer.count} (all: ${hiByCountry.map((c) => `${c.country} ${c.count}`).join(', ')}) |`,
  `| Analytics | How many instruments are at the "implementation" stage? | ${implementationCount} |`,
  `| Parallel Sets | With columns Type and Impact/Influence, how many "law" entries are "binding"? | ${lawBinding} |`,
  `| Cluster Analysis | How many stakeholders are in the "administration" cluster (by Actor Type)? | ${adminCluster} |`,
  `| Network Graph | How many steps from BMBF to Diakonie Deutschland? | ${networkAnswer.steps ?? 'no path'}${networkAnswer.path ? ` (${networkAnswer.path.join(' → ')})` : ''} |`,
  `| Text Analysis | Ignoring "itc", what is the largest word for Germany and for New Zealand? | ${textAnswer.map((t) => `${t.country}: ${t.top[0]?.text} (${t.top[0]?.count}; next ${t.top.slice(1, 3).map((w) => `${w.text} ${w.count}`).join(', ')})`).join('; ')} |`,
  '',
  '## Dataset facts (report Section 5.3)',
  '',
  `- Entities: ${facts.entities} (${facts.stakeholders} stakeholders, ${facts.instruments} instruments); parse warnings: ${facts.parseWarnings}`,
  `- Per country: ${perCountry.map((c) => `${c.country} ${c.stakeholders}+${c.instruments}`).join(', ')}`,
  `- Entities declaring at least one connection: ${declaring}`,
  `- Raw connection references: ${rawReferences}; resolved: ${resolvedReferences}; unresolved: ${facts.unresolvedReferences}`,
  `- Undirected edges: ${facts.edges}; cross-country edges: ${crossCountryEdges.length}`,
  ...facts.crossCountryEdges.map((e) => `  - ${e}`),
  `- Connected components: ${facts.components} (${isolated.length} isolated nodes, ${linked.length} linked clusters; cluster sizes ${facts.linkedClusterSizes.join(', ')})`,
  ...facts.isolatedNodes.map((n) => `  - isolated: ${n}`),
  `- Text Analysis: ${facts.textAnalysis.stopWords} stop words, top ${facts.textAnalysis.wordsPerCloud} words per cloud`,
  '',
].join('\n')
writeFileSync(path.join(OUT, 'answer-key.md'), md)
console.log(md)
