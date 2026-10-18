// Quantitative checks behind the design-audit notes (AUDIT.md; report
// Section 5.5, Table 10). Each check measures, on the eight demonstration
// workbooks, how often a defect would actually show up, using the same
// functions the views use.
//
// Usage: npm run audit-checks
// Output: design-audit/checks.md and checks.json
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { loadWorkbooks, demoFiles } from '../lib/load'
import { buildGraphData } from '@/utils/graph/buildGraphData'
import { groupByTheme, groupByGeographicalScope } from '@/utils/analytics/grouping'
import { computeParallelSetsLayout, PS_CANDIDATE_DIMENSIONS } from '@/utils/analytics/parallelSets'
import { filterEntities } from '@/utils/filterEntities'
import { DEFAULT_FILTERS } from '@/types/filters'
import { extractWords, TEXT_FIELDS } from '@/utils/textFrequency'

const OUT = path.resolve('design-audit')
const { entities } = loadWorkbooks(demoFiles())
const graph = buildGraphData(entities)

// D2: nodes whose detail panel ("declared" connections only) shows fewer
// neighbours than the undirected graph draws.
const degree = new Map<string, Set<string>>()
for (const n of graph.nodes) degree.set(n.id, new Set())
for (const e of graph.edges) {
  degree.get(e.source as string)!.add(e.target as string)
  degree.get(e.target as string)!.add(e.source as string)
}
const ids = new Set(entities.map((e) => e.id))
const d2 = entities
  .map((e) => ({ name: e.name, declared: e.connections.filter((c) => ids.has(c)).length, graph: degree.get(e.id)!.size }))
  .filter((x) => x.declared < x.graph)
const d2Zero = d2.filter((x) => x.declared === 0)

// D5: multi-valued themes counted in every group (Analytics, Cluster
// Analysis) versus first value only (Parallel Sets).
const themeGroups = groupByTheme(entities)
const themeTotal = themeGroups.reduce((s, g) => s + g.count, 0)
const psTheme = computeParallelSetsLayout(entities, [PS_CANDIDATE_DIMENSIONS.find((d) => d.key === 'category')!, PS_CANDIDATE_DIMENSIONS.find((d) => d.key === 'primaryTheme')!])
const psThemeCounts = new Map(psTheme.columns[1].nodes.map((n) => [n.value, n.count]))
const d5 = themeGroups.map((g) => ({ theme: g.label, analytics: g.count, parallelSets: psThemeCounts.get(g.label) ?? 0 }))
const scopeTotal = groupByGeographicalScope(entities).reduce((s, g) => s + g.count, 0)

// D3 / D4: a filter that excludes every entity of one country. Views on the
// filtered set drop it; Text Analysis and the map fill do not.
const filtered = filterEntities(entities, { ...DEFAULT_FILTERS, countries: ['Germany'] })
const d4 = { filter: 'country = Germany', filteredEntities: filtered.length, countriesStillFilledOnMap: new Set(entities.map((e) => e.country)).size }

// D6: entities placed on Belgium because their country is "EU".
const d6 = entities.filter((e) => e.country.trim().toLowerCase() === 'eu').length

// D8: words containing letters outside a-z in the text fields, and what the
// word-frequency module counts them as.
const d8 = new Map<string, { countedAs: string[]; occurrences: number; countries: Set<string> }>()
for (const e of entities) {
  const seen = new Set<string>()
  for (const f of TEXT_FIELDS) {
    const v = (e as unknown as Record<string, unknown>)[f]
    if (typeof v !== 'string' || !v || seen.has(v)) continue
    seen.add(v)
    for (const w of v.split(/[\s,.;:()"“”!?]+/)) {
      if (/[^\x00-\x7f]/.test(w.replace(/[–—‘’]/g, '')) && /\p{L}/u.test(w)) {
        const key = w.replace(/^['‘’]+|['‘’]+$/g, '')
        const cur = d8.get(key) ?? { countedAs: extractWords(key), occurrences: 0, countries: new Set<string>() }
        cur.occurrences++
        cur.countries.add(e.country)
        d8.set(key, cur)
      }
    }
  }
}
const d8Rows = [...d8.entries()].sort((a, b) => b[1].occurrences - a[1].occurrences)

const result = {
  generatedAt: new Date().toISOString(),
  D2: { nodesUnderReported: d2.length, nodesShowingZero: d2Zero.length, examples: d2Zero.slice(0, 5) },
  D3D4: d4,
  D5: { entities: entities.length, themeGroupTotal: themeTotal, scopeGroupTotal: scopeTotal, perTheme: d5 },
  D6: { entitiesDrawnOnBelgium: d6 },
  D8: d8Rows.map(([w, v]) => ({ word: w, countedAs: v.countedAs, occurrences: v.occurrences, countries: [...v.countries] })),
}
writeFileSync(path.join(OUT, 'checks.json'), JSON.stringify(result, null, 2))

const md = [
  '# Design-audit checks on the demonstration workbooks',
  '',
  `Generated ${result.generatedAt} by \`npm run audit-checks\`.`,
  '',
  `- **D2** ${d2.length} of ${entities.length} entities have more neighbours in the graph than their detail panel lists; ${d2Zero.length} show "Connections 0" while having visible edges${d2Zero.length ? ` (e.g. ${d2Zero.slice(0, 3).map((x) => `${x.name}: ${x.graph} edge(s)`).join('; ')})` : ''}.`,
  `- **D3/D4** With the filter ${d4.filter}, the filtered views show ${d4.filteredEntities} entities, while Text Analysis can still compare any country and the map still fills all ${d4.countriesStillFilledOnMap} countries with their full counts.`,
  `- **D5** ${entities.length} entities, but thematic-focus groups in Analytics and Cluster Analysis total ${themeTotal} and geographical-scope groups ${scopeTotal}. Per theme (Analytics vs Parallel Sets primary theme): ${d5.map((x) => `${x.theme} ${x.analytics} vs ${x.parallelSets}`).join('; ')}.`,
  `- **D6** ${d6} EU-level entities are drawn on Belgium.`,
  `- **D8** Words split by the word-frequency module: ${d8Rows.map(([w, v]) => `"${w}" → ${v.countedAs.map((c) => `"${c}"`).join(' + ') || '(nothing)'} (${v.occurrences}×, ${[...v.countries].join('/')})`).join('; ')}.`,
  '',
].join('\n')
writeFileSync(path.join(OUT, 'checks.md'), md)
console.log(md)
