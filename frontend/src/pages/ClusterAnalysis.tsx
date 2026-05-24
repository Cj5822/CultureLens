import type { FilterState } from '@/types';

interface ClusterAnalysisProps {
  filters: FilterState;
}

export function ClusterAnalysis({ filters: _filters }: ClusterAnalysisProps) {
  return (
    <div className="cl-page">
      <div className="cl-page-card">
        <h2 className="cl-page-title">Cluster Analysis</h2>
        <div className="cl-page-placeholder">
          <span className="cl-page-placeholder-label">Cluster Analysis</span>
          <p className="cl-page-placeholder-hint">Hierarchical cluster and subgroup visualizations will render here</p>
        </div>
      </div>
    </div>
  );
}
