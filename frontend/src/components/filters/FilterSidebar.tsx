import { useMemo } from 'react'
import { X, Search, ChevronLeft, Columns3 } from 'lucide-react'
import type { EntityFilters } from '@/types/filters'
import type { ViewType } from '@/types'
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
import { useParallelSetsColumns } from '@/context/ParallelSetsContext'

export interface FilterSidebarProps {
  filters: EntityFilters
  onChange: (filters: EntityFilters) => void
  resultCount: number
  countries: readonly string[]
  onCollapse?: () => void
  /** When 'parallelsets', each section gets a "show as column" toggle. */
  activeView?: ViewType
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

// ─── Parallel Sets column toggle ────────────────────────────────────────────
//
// Rendered in a FilterSection's header when the Parallel Sets view is active,
// so the same sidebar that filters entities also picks which fields show up
// as columns in the diagram — no separate control panel needed.

function ColumnToggleButton({ dimensionKey }: { dimensionKey: string }) {
  const { isColumnActive, toggleColumn, canAdd, canRemove } = useParallelSetsColumns()
  const active = isColumnActive(dimensionKey)
  const disabled = active ? !canRemove : !canAdd
  const title = active
    ? canRemove
      ? 'Remove from the Parallel Sets diagram'
      : 'At least 2 variables must stay shown'
    : canAdd
      ? 'Show as a column in the Parallel Sets diagram'
      : 'Up to 5 variables can be shown at once'

  return (
    <button
      type="button"
      className={`cl-filter-column-toggle${active ? ' cl-filter-column-toggle--active' : ''}`}
      onClick={() => toggleColumn(dimensionKey)}
      disabled={disabled}
      title={title}
      aria-pressed={active}
      aria-label={title}
    >
      <Columns3 size={12} aria-hidden />
    </button>
  )
}

export function FilterSidebar({ filters, onChange, resultCount, countries, onCollapse, activeView }: FilterSidebarProps) {
  const activeCount = useMemo(() => countActive(filters), [filters])
  const showColumnToggles = activeView === 'parallelsets'

  function update<K extends keyof EntityFilters>(key: K, value: EntityFilters[K]) {
    onChange({ ...filters, [key]: value })
  }

  function columnToggle(dimensionKey: string) {
    return showColumnToggles ? <ColumnToggleButton dimensionKey={dimensionKey} /> : undefined
  }

  return (
    <aside className="cl-filter-sidebar" aria-label="Entity filters">
      {/* Header */}
      <div className="cl-filter-sidebar__header">
        <span className="cl-filter-sidebar__title">
          {onCollapse && (
            <button
              type="button"
              className="cl-filter-collapse"
              onClick={onCollapse}
              aria-label="Hide filters"
              title="Hide filters"
            >
              <ChevronLeft size={14} aria-hidden />
            </button>
          )}
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

      {showColumnToggles && (
        <p className="cl-filter-sidebar__hint">
          <Columns3 size={11} aria-hidden /> Toggle a section to add or remove it as a column in the Parallel Sets diagram.
        </p>
      )}

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
        <FilterSection title="Category" defaultOpen headerAction={columnToggle('category')}>
          <MultiSelectFilter<'stakeholders' | 'instruments'>
            label="Category"
            options={CATEGORY_OPTIONS}
            selected={filters.categories}
            onChange={(v) => update('categories', v)}
          />
        </FilterSection>

        <FilterSection title="Actor Type" headerAction={columnToggle('type')}>
          <MultiSelectFilter<ActorType>
            label="Actor type"
            options={ACTOR_TYPE_OPTIONS}
            selected={filters.actorTypes}
            onChange={(v) => update('actorTypes', v)}
          />
        </FilterSection>

        <FilterSection title="Instrument Type" headerAction={columnToggle('type')}>
          <MultiSelectFilter<InstrumentType>
            label="Instrument type"
            options={INSTRUMENT_TYPE_OPTIONS}
            selected={filters.instrumentTypes}
            onChange={(v) => update('instrumentTypes', v)}
          />
        </FilterSection>

        <FilterSection title="Thematic Focus" headerAction={columnToggle('primaryTheme')}>
          <MultiSelectFilter<ThematicFocus>
            label="Thematic focus"
            options={THEMATIC_FOCUS_OPTIONS}
            selected={filters.thematicFocus}
            onChange={(v) => update('thematicFocus', v)}
          />
        </FilterSection>

        <FilterSection title="Geographical Scope" headerAction={columnToggle('primaryGeographicalScope')}>
          <MultiSelectFilter<GeographicalScope>
            label="Geographical scope"
            options={GEOGRAPHICAL_SCOPE_OPTIONS}
            selected={filters.geographicalScope}
            onChange={(v) => update('geographicalScope', v)}
          />
        </FilterSection>

        <FilterSection title="Impact & Influence" headerAction={columnToggle('impactInfluence')}>
          <MultiSelectFilter<ImpactInfluence>
            label="Impact and influence"
            options={IMPACT_INFLUENCE_OPTIONS}
            selected={filters.impactInfluence}
            onChange={(v) => update('impactInfluence', v)}
          />
        </FilterSection>

        <FilterSection title="Implementation Status" headerAction={columnToggle('implementationStatus')}>
          <MultiSelectFilter<ImplementationStatus>
            label="Implementation status"
            options={IMPLEMENTATION_STATUS_OPTIONS}
            selected={filters.implementationStatus}
            onChange={(v) => update('implementationStatus', v)}
          />
        </FilterSection>

        <FilterSection title="Recommended Next Steps" headerAction={columnToggle('recommendedNextSteps')}>
          <MultiSelectFilter<RecommendedNextSteps>
            label="Recommended next steps"
            options={RECOMMENDED_NEXT_STEPS_OPTIONS}
            selected={filters.recommendedNextSteps}
            onChange={(v) => update('recommendedNextSteps', v)}
          />
        </FilterSection>

        {countries.length > 0 && (
          <FilterSection title="Country / Partner Region" headerAction={columnToggle('country')}>
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
