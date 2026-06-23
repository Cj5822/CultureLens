import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { ImportModal } from '@/components/import/ImportModal'
import { MapView } from './MapView'
import { Analytics } from './Analytics'
import { ClusterAnalysis } from './ClusterAnalysis'
import { NetworkGraph } from './NetworkGraph'
import { TextAnalysis } from './TextAnalysis'
import { FilterContextProvider, useFilterContext } from '@/context/FilterContext'
import { DataContextProvider } from '@/context/DataContext'
import type { ViewType } from '@/types'

// ─── Page registry ─────────────────────────────────────────────────────────────

const PAGE_COMPONENTS: Record<ViewType, React.FC> = {
  map:       MapView,
  analytics: Analytics,
  cluster:      ClusterAnalysis,
  network:      NetworkGraph,
  textanalysis: TextAnalysis,
}

// ─── Shared filter sidebar (must be inside FilterContextProvider) ──────────────

interface FilterSidebarShellProps {
  open: boolean
  onCollapse: () => void
}

function FilterSidebarShell({ open, onCollapse }: FilterSidebarShellProps) {
  const { filters, setFilters, filteredEntities, countries } = useFilterContext()
  if (!open) return null

  return (
    <FilterSidebar
      filters={filters}
      onChange={setFilters}
      resultCount={filteredEntities.length}
      countries={countries}
      onCollapse={onCollapse}
    />
  )
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────

export function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('map')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [importOpen, setImportOpen] = useState(false)
  const PageComponent = PAGE_COMPONENTS[activeView]

  return (
    <DataContextProvider>
    <FilterContextProvider>
      {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
      <div className="cl-app">
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          onImportClick={() => setImportOpen(true)}
        />

        <FilterSidebarShell
          open={filtersOpen}
          onCollapse={() => setFiltersOpen(false)}
        />

        <div className={`cl-main${filtersOpen ? '' : ' cl-main--filters-hidden'}`}>
          {/* Expand button — floats over the content when sidebar is hidden */}
          {!filtersOpen && (
            <button
              type="button"
              className="cl-filter-expand-btn"
              onClick={() => setFiltersOpen(true)}
              aria-label="Show filters"
              title="Show filters"
            >
              <SlidersHorizontal size={14} aria-hidden />
            </button>
          )}
          <main className="cl-content">
            <PageComponent />
          </main>
        </div>
      </div>
    </FilterContextProvider>
    </DataContextProvider>
  )
}
