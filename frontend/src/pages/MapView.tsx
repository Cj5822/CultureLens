import type { FilterState } from '@/types';
import { WorldMap } from '@/components/map/WorldMap';

interface MapViewProps {
  filters: FilterState;
}

export function MapView({ filters: _filters }: MapViewProps) {
  return (
    <div className="cl-page">
      <div className="cl-page-card">
        <h2 className="cl-page-title">European Research Network</h2>
        <div className="cl-map-wrap">
          <WorldMap height="100%" />
          <div className="cl-map-legend">
            <span className="cl-map-legend-item cl-map-legend-item--partner">
              Partner region
            </span>
            <span className="cl-map-legend-item cl-map-legend-item--other">
              Other
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
