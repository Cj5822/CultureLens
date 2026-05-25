import type {
  ActorType,
  InstrumentType,
  ImpactInfluence,
  ImplementationStatus,
  RecommendedNextSteps,
  ThematicFocus,
  GeographicalScope,
} from '@/types/entities'

// ─── Filter state ──────────────────────────────────────────────────────────────

export interface EntityFilters {
  categories: ('stakeholders' | 'instruments')[]
  actorTypes: ActorType[]
  instrumentTypes: InstrumentType[]
  thematicFocus: ThematicFocus[]
  geographicalScope: GeographicalScope[]
  impactInfluence: ImpactInfluence[]
  implementationStatus: ImplementationStatus[]
  recommendedNextSteps: RecommendedNextSteps[]
  countries: string[]
  search: string
}

export const DEFAULT_FILTERS: EntityFilters = {
  categories: [],
  actorTypes: [],
  instrumentTypes: [],
  thematicFocus: [],
  geographicalScope: [],
  impactInfluence: [],
  implementationStatus: [],
  recommendedNextSteps: [],
  countries: [],
  search: '',
}

// ─── Typed option arrays ───────────────────────────────────────────────────────

export const CATEGORY_OPTIONS = ['stakeholders', 'instruments'] as const satisfies readonly string[]

export const ACTOR_TYPE_OPTIONS: readonly ActorType[] = [
  'academia',
  'civil society',
  'government',
  'NGO',
  'administration',
  'private sector',
  'other',
]

export const INSTRUMENT_TYPE_OPTIONS: readonly InstrumentType[] = [
  'law',
  'guideline',
  'petition',
  'initiative',
  'strategy',
  'other',
]

export const THEMATIC_FOCUS_OPTIONS: readonly ThematicFocus[] = [
  'Inter- and Transcultural Competences',
  'Inter- and Transculturality',
  'Education',
  'Culture',
  'Migration',
  'Climate',
  'Other',
]

export const GEOGRAPHICAL_SCOPE_OPTIONS: readonly GeographicalScope[] = [
  'local',
  'regional',
  'cross-regional',
  'national',
  'local and regional',
  'local and cross-regional',
  'regional and national',
  'cross-regional and national',
  'local and national',
  'all of the above',
]

export const IMPACT_INFLUENCE_OPTIONS: readonly ImpactInfluence[] = [
  'symbolic',
  'advisory',
  'binding',
  'highly influential',
]

export const IMPLEMENTATION_STATUS_OPTIONS: readonly ImplementationStatus[] = [
  'draft',
  'development',
  'implementation',
  'evaluation',
  'archive',
]

export const RECOMMENDED_NEXT_STEPS_OPTIONS: readonly RecommendedNextSteps[] = [
  'engage',
  'contact',
  'monitor',
  'no action',
]
