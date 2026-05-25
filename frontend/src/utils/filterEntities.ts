import type { Entity } from '@/types/entities'
import type { EntityFilters } from '@/types/filters'

// ─── Text search ───────────────────────────────────────────────────────────────

function matchesSearch(entity: Entity, query: string): boolean {
  const q = query.toLowerCase()
  const shared = [
    entity.name,
    entity.country,
    entity.additionalRemarks,
    entity.equityAddressed,
    entity.intendedAudience,
    entity.impactInfluence,
    entity.recommendedNextSteps,
    ...entity.thematicFocus,
    ...entity.geographicalScope,
    ...entity.languages,
  ]

  const specific =
    entity.category === 'stakeholders'
      ? [entity.description, entity.relevanceToINTRACOMP, entity.relationToITC, entity.actorType]
      : [
          entity.responsibleInstitution,
          entity.mainObjectives,
          entity.relevanceToINTRACOMP,
          entity.instrumentType,
          entity.implementationStatus,
        ]

  return [...shared, ...specific].some((f) => f.toLowerCase().includes(q))
}

// ─── Main filter function ──────────────────────────────────────────────────────

/**
 * Filters entities against the provided EntityFilters.
 *
 * Combining rules:
 *  - Different filter groups combine with AND logic.
 *  - Multiple values within a single group combine with OR logic.
 *  - actorTypes / implementationStatus only constrain entities of the
 *    matching category; entities of the other category pass freely.
 *  - thematicFocus and geographicalScope are multi-value fields on each
 *    entity — any overlap with the selected values counts as a match.
 */
export function filterEntities(entities: Entity[], filters: EntityFilters): Entity[] {
  return entities.filter((entity) => {
    // Category
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(entity.category)
    ) {
      return false
    }

    // Actor type — only constrains stakeholders
    if (filters.actorTypes.length > 0 && entity.category === 'stakeholders') {
      if (!filters.actorTypes.includes(entity.actorType)) return false
    }

    // Instrument type — only constrains instruments
    if (filters.instrumentTypes.length > 0 && entity.category === 'instruments') {
      if (!filters.instrumentTypes.includes(entity.instrumentType)) return false
    }

    // Implementation status — only constrains instruments
    if (filters.implementationStatus.length > 0 && entity.category === 'instruments') {
      if (!filters.implementationStatus.includes(entity.implementationStatus)) return false
    }

    // Thematic focus — OR across entity's multi-value field
    if (filters.thematicFocus.length > 0) {
      if (!entity.thematicFocus.some((f) => filters.thematicFocus.includes(f))) return false
    }

    // Geographical scope — OR across entity's multi-value field
    if (filters.geographicalScope.length > 0) {
      if (!entity.geographicalScope.some((s) => filters.geographicalScope.includes(s))) return false
    }

    // Impact / influence
    if (
      filters.impactInfluence.length > 0 &&
      !filters.impactInfluence.includes(entity.impactInfluence)
    ) {
      return false
    }

    // Recommended next steps
    if (
      filters.recommendedNextSteps.length > 0 &&
      !filters.recommendedNextSteps.includes(entity.recommendedNextSteps)
    ) {
      return false
    }

    // Country
    if (filters.countries.length > 0 && !filters.countries.includes(entity.country)) {
      return false
    }

    // Free-text search
    if (filters.search && !matchesSearch(entity, filters.search)) {
      return false
    }

    return true
  })
}
