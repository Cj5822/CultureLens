import { useState, useCallback } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { MapView } from './MapView';
import { Analytics } from './Analytics';
import { ClusterAnalysis } from './ClusterAnalysis';
import { NetworkGraph } from './NetworkGraph';
import type { ViewType, FilterState } from '@/types';

const PAGE_COMPONENTS: Record<ViewType, React.FC<{ filters: FilterState }>> = {
  map: MapView,
  analytics: Analytics,
  cluster: ClusterAnalysis,
  network: NetworkGraph,
};

export function Dashboard() {
  const [activeView, setActiveView] = useState<ViewType>('map');
  const [filters, setFilters] = useState<FilterState>({
    country: 'All',
    organisationType: 'All',
    competencyCategory: 'All',
  });

  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const PageComponent = PAGE_COMPONENTS[activeView];

  return (
    <div className="cl-app">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
      />

      <div className="cl-main">
        <TopBar
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <main className="cl-content">
          <PageComponent filters={filters} />
        </main>
      </div>
    </div>
  );
}
