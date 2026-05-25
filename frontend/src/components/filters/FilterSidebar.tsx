import { useMemo } from 'react'
import { X, Search } from 'lucide-react'
import type { EntityFilters } from '@/types/filters'
import type {
  ActorType,
  InstrumentType,
  ImpactInfluence,
  ImplementationStatus,
  RecommendedNextSteps,
  ThematicFocus,
  GeographicalScope,
} from '@/types/entities'
import {
  CATEGORY_OPTIONS,
  ACTOR_TYPE_OPTIONS,
  INSTRUMENT_TYPE_OPTIONS,
  THEMATIC_FOCUS_OPTIONS,
  GEOGRAPHICAL_SCOPE_OPTIONS,
  IMPACT_INFLUENCE_OPTIONS,
  IMPLEMENTATION_STATUS_OPTIONS,
  RECOMMENDED_NEXT_STEPS_OPTIONS,
  DEFAULT_FILTERS,
} from '@/types/filters'
import { FilterSection } from './FilterSection'
import { MultiSelectFilter } from './MultiSelectFilter'

export interface FilterSidebarProps {
  filters: EntityFilters
  onChange: (filters: EntityFilters) => void
  resultCount: number
  countries: readonly string[]
}

function countActive(filters: EntityFilters): number {
  return (
    filters.categories.length +
    filters.actorTypes.length +
    filters.instrumentTypes.length +
    filters.thematicFocus.length +
    filters.geographicalScope.length +
    filters.impactInfluence.length +
    filters.implementationStatus.length +
    filters.recommendedNextSteps.length +
    filters.countries.length +
    (filters.search.trim() ? 1 : 0)
  )
}

export function FilterSidebar({ filters, onChange, resultCount, countries }: FilterSidebarProps) {
  const activeCount = useMemo(() => countActive(filters), [filters])

  function update<K extends keyof EntityFilters>(key: K, value: EntityFilters[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <aside className="cl-filter-sidebar" aria-label="Entity filters">
      {/* Header */}
      <div className="cl-filter-sidebar__header">
        <span className="cl-filter-sidebar__title">
          Filters
          {activeCount > 0 && (
            <span className="cl-filter-badge" aria-label={`${activeCount} active filters`}>
              {activeCount}
            </span>
          )}
        </span>
        {activeCount > 0 && (
          <button
            type="button"
            className="cl-filter-clear"
            onClick={() => onChange(DEFAULT_FILTERS)}
            aria-label="Clear all filters"
          >
            <X size={11} aria-hidden />
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="cl-filter-sidebar__results">
        {resultCount} result{resultCount !== 1 ? 's' : ''}
      </p>

      {/* Free-text search */}
      <div className="cl-filter-search">
        <Search size={13} className="cl-filter-search__icon" aria-hidden />
        <input
          type="search"
          placeholder="Search entities…"
          value={filters.search}
          onChange={(e) => update('search', e.target.value)}
          className="cl-filter-search__input"
          aria-label="Search entities"
        />
      </div>

      {/* Filter sections */}
      <div className="cl-filter-sidebar__sections">
        <FilterSection title="Category" defaultOpen>
          <MultiSelectFilter<'stakeholders' | 'instruments'>
            label="Category"
            options={CATEGORY_OPTIONS}
            selected={filters.categories}
            onChange={(v) => update('categories', v)}
          />
        </FilterSection>

        <FilterSection title="Actor Type">
          <MultiSelectFilter<ActorType>
            label="Actor type"
            options={ACTOR_TYPE_OPTIONS}
            selected={filters.actorTypes}
            onChange={(v) => update('actorTypes', v)}
          />
        </FilterSection>

        <FilterSection title="Instrument Type">
          <MultiSelectFilter<InstrumentType>
            label="Instrument type"
            options={INSTRUMENT_TYPE_OPTIONS}
            selected={filters.instrumentTypes}
            onChange={(v) => update('instrumentTypes', v)}
          />
        </FilterSection>

        <FilterSection title="Thematic Focus">
          <MultiSelectFilter<ThematicFocus>
            label="Thematic focus"
            options={THEMATIC_FOCUS_OPTIONS}
            selected={filters.thematicFocus}
            onChange={(v) => update('thematicFocus', v)}
          />
        </FilterSection>

        <FilterSection title="Geographical Scope">
          <MultiSelectFilter<GeographicalScope>
            label="Geographical scope"
            options={GEOGRAPHICAL_SCOPE_OPTIONS}
            selected={filters.geographicalScope}
            onChange={(v) => update('geographicalScope', v)}
          />
        </FilterSection>

        <FilterSection title="Impact & Influence">
          <MultiSelectFilter<ImpactInfluence>
            label="Impact and influence"
            options={IMPACT_INFLUENCE_OPTIONS}
            selected={filters.impactInfluence}
            onChange={(v) => update('impactInfluence', v)}
          />
        </FilterSection>

        <FilterSection title="Implementation Status">
          <MultiSelectFilter<ImplementationStatus>
            label="Implementation status"
            options={IMPLEMENTATION_STATUS_OPTIONS}
            selected={filters.implementationStatus}
            onChange={(v) => update('implementationStatus', v)}
          />
        </FilterSection>

        <FilterSection title="Recommended Next Steps">
          <MultiSelectFilter<RecommendedNextSteps>
            label="Recommended next steps"
            options={RECOMMENDED_NEXT_STEPS_OPTIONS}
            selected={filters.recommendedNextSteps}
            onChange={(v) => update('recommendedNextSteps', v)}
          />
        </FilterSection>

        {countries.length > 0 && (
          <FilterSection title="Country / Partner Region">
            <MultiSelectFilter<string>
              label="Country"
              options={countries}
              selected={filters.countries}
              onChange={(v) => update('countries', v)}
            />
          </FilterSection>
        )}
      </div>
    </aside>
  )
}
