import type { FilterState } from '@/types';

interface NetworkGraphProps {
  filters: FilterState;
}

export function NetworkGraph({ filters: _filters }: NetworkGraphProps) {
  return (
    <div className="cl-page">
      <div className="cl-page-card">
        <h2 className="cl-page-title">Network Graph</h2>
        <div className="cl-page-placeholder">
          <span className="cl-page-placeholder-label">Network Graph</span>
          <p className="cl-page-placeholder-hint">Stakeholder relationship network will render here</p>
        </div>
      </div>
    </div>
  );
}
