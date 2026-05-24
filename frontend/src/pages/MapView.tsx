import type { FilterState } from '@/types';

interface MapViewProps {
  filters: FilterState;
}

export function MapView({ filters: _filters }: MapViewProps) {
  return (
    <div className="cl-page">
      <div className="cl-page-card">
        <h2 className="cl-page-title">European Research Network</h2>
        <div className="cl-page-placeholder">
          <span className="cl-page-placeholder-label">Map View</span>
          <p className="cl-page-placeholder-hint">Interactive map will render here</p>
        </div>
      </div>
    </div>
  );
}
