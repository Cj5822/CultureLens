import { useState } from 'react'
import { SlidersHorizontal, FileSpreadsheet } from 'lucide-react'
import { Sidebar } from '@/components/layout/Sidebar'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { ImportModal } from '@/components/import/ImportModal'
import { MapView } from './MapView'
import { Analytics } from './Analytics'
import { ParallelSets } from './ParallelSets'
import { ClusterAnalysis } from './ClusterAnalysis'
import { NetworkGraph } from './NetworkGraph'
import { TextAnalysis } from './TextAnalysis'
import { FilterContextProvider, useFilterContext } from '@/context/FilterContext'
import { ParallelSetsColumnsProvider } from '@/context/ParallelSetsContext'
import { DataContextProvider, useDataContext } from '@/context/DataContext'
import type { ViewType } from '@/types'

const PAGE_COMPONENTS: Record<ViewType, React.FC> = {
  map:          MapView,
  analytics:    Analytics,
  parallelsets: ParallelSets,
  cluster:      ClusterAnalysis,
  network:      NetworkGraph,
  textanalysis: TextAnalysis,
}

interface FilterSidebarShellProps {
  open: boolean
  onCollapse: () => void
  activeView: ViewType
}

function FilterSidebarShell({ open, onCollapse, activeView }: FilterSidebarShellProps) {
  const { filters, setFilters, filteredEntities, countries } = useFilterContext()
  if (!open) return null

  return (
    <FilterSidebar
      filters={filters}
      onChange={setFilters}
      resultCount={filteredEntities.length}
      countries={countries}
      onCollapse={onCollapse}
      activeView={activeView}
    />
  )
}

function EmptyStatePrompt({ onImportClick }: { onImportClick: () => void }) {
  return (
    <div className="cl-empty-state">
      <FileSpreadsheet size={48} className="cl-empty-state__icon" />
      <h2 className="cl-empty-state__title">No data loaded</h2>
      <p className="cl-empty-state__desc">
        Import a Policy Mapping Template Excel file to start exploring stakeholders and instruments.
      </p>
      <button className="cl-btn cl-btn--primary" onClick={onImportClick}>
        Import Excel file
      </button>
    </div>
  )
}

function DashboardShell() {
  const { entities } = useDataContext()
  const [activeView, setActiveView] = useState<ViewType>('map')
  const [filtersOpen, setFiltersOpen] = useState(true)
  const [importOpen, setImportOpen] = useState(false)
  const PageComponent = PAGE_COMPONENTS[activeView]
  const hasData = entities.length > 0

  return (
    <FilterContextProvider>
      <ParallelSetsColumnsProvider>
        {importOpen && <ImportModal onClose={() => setImportOpen(false)} />}
        <div className="cl-app">
          <Sidebar
            activeView={activeView}
            onNavigate={setActiveView}
            onImportClick={() => setImportOpen(true)}
          />

          {hasData && (
            <FilterSidebarShell
              open={filtersOpen}
              onCollapse={() => setFiltersOpen(false)}
              activeView={activeView}
            />
          )}

          <div className={`cl-main${!hasData || filtersOpen ? '' : ' cl-main--filters-hidden'}`}>
            {hasData && !filtersOpen && (
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
              {hasData
                ? <PageComponent />
                : <EmptyStatePrompt onImportClick={() => setImportOpen(true)} />
              }
            </main>
          </div>
        </div>
      </ParallelSetsColumnsProvider>
    </FilterContextProvider>
  )
}

export function Dashboard() {
  return (
    <DataContextProvider>
      <DashboardShell />
    </DataContextProvider>
  )
}
