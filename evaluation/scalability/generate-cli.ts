// Writes a generated benchmark dataset to disk, so the same data can also be
// imported into the running application (for example to check in-browser
// rendering cost, which the benchmark itself does not measure).
//
// Usage: npm run generate-dataset -- <entities> [outDir]
//   e.g. npm run generate-dataset -- 1000
// Writes one template-layout workbook per country plus dataset.json to
// scalability/datasets/<entities>/ (or outDir).
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import * as XLSX from 'xlsx'
import { generateDataset, COUNTRIES } from './generate'
import { STAKEHOLDER_HEADERS, INSTRUMENT_HEADERS, metaRows, buildWorkbook } from '../lib/template'
import type { Stakeholder, Instrument } from '@/types/entities'

const n = Number(process.argv[2])
if (!Number.isFinite(n) || n <= 0) {
  console.error('Usage: npm run generate-dataset -- <entities> [outDir]')
  process.exit(1)
}
const outDir = path.resolve(process.argv[3] ?? path.join('scalability', 'datasets', String(n)))
mkdirSync(outDir, { recursive: true })

const { entities, connected, references } = generateDataset(n)
writeFileSync(path.join(outDir, 'dataset.json'), JSON.stringify({ entities: n, connected, references, data: entities }, null, 2))

const join = (xs: string[]) => xs.join('; ')
for (const country of COUNTRIES) {
  const stk = entities.filter((e): e is Stakeholder => e.category === 'stakeholders' && e.country === country)
  const ins = entities.filter((e): e is Instrument => e.category === 'instruments' && e.country === country)
  const meta = metaRows({ partner: 'Generated', date: '2026-01-01', country, remarks: `Synthetic benchmark dataset (${n} entities)` })
  const wb = buildWorkbook([
    {
      name: 'Stakeholders', above: [...meta, []], headers: STAKEHOLDER_HEADERS,
      data: stk.map((e) => [
        'Stakeholders', e.actorType, join(e.thematicFocus), e.name, e.link, join(e.geographicalScope),
        e.functionalRole, e.description, e.impactInfluence, e.relevanceToINTRACOMP, e.additionalRemarks,
        e.itcApproach, e.equityAddressed, e.intendedAudience, join(e.languages), e.recommendedNextSteps, join(e.connections),
      ]),
    },
    {
      name: 'Instruments', above: meta, headers: INSTRUMENT_HEADERS,
      data: ins.map((e) => [
        'Instruments', join(e.thematicFocus), e.instrumentType, e.name, e.link, join(e.geographicalScope),
        e.responsibleInstitution, e.mainObjectives, e.implementationStatus, e.relevanceToINTRACOMP, e.impactInfluence,
        e.itcApproach, e.equityAddressed, e.intendedAudience, join(e.languages), e.recommendedNextSteps, join(e.connections),
      ]),
    },
  ])
  XLSX.writeFile(wb, path.join(outDir, `Generated_${n}_${country.replace(/\s+/g, '_')}.xlsx`))
}
console.log(`Wrote ${n} entities (${connected} declaring ${references} references) to ${outDir}`)
