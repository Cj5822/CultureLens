import type { FilterState } from '@/types';

interface AnalyticsProps {
  filters: FilterState;
}

export function Analytics({ filters: _filters }: AnalyticsProps) {
  return (
    <div className="cl-page">
      <div className="cl-page-card">
        <h2 className="cl-page-title">Analytics</h2>
        <div className="cl-page-placeholder">
          <span className="cl-page-placeholder-label">Analytics</span>
          <p className="cl-page-placeholder-hint">Correlation heatmaps and charts will render here</p>
        </div>
      </div>
    </div>
  );
}
