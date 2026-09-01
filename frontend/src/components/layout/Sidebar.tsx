import { Map, BarChart2, Waves, Layers, Share2, Type, Upload } from 'lucide-react';
import type { ViewType } from '@/types';
import { useDataContext } from '@/context/DataContext';

interface SidebarProps {
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  onImportClick: () => void;
}

const navItems: { id: ViewType; label: string; Icon: React.FC<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'map',       label: 'Map View',        Icon: Map },
  { id: 'analytics', label: 'Analytics',       Icon: BarChart2 },
  { id: 'parallelsets', label: 'Parallel Sets',   Icon: Waves },
  { id: 'cluster',      label: 'Cluster Analysis', Icon: Layers },
  { id: 'network',      label: 'Network Graph',   Icon: Share2 },
  { id: 'textanalysis', label: 'Text Analysis',   Icon: Type },
];

export function Sidebar({ activeView, onNavigate, onImportClick }: SidebarProps) {
  const { isImported } = useDataContext();
  return (
    <aside className="cl-sidebar">
      {/* Header */}
      <div className="cl-sidebar-header">
        <div className="cl-sidebar-brand">
          {/* Globe icon */}
          <div className="cl-sidebar-logo" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
              <ellipse cx="16" cy="16" rx="6" ry="14" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
              <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
              <line x1="4" y1="10" x2="28" y2="10" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
              <line x1="4" y1="22" x2="28" y2="22" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            </svg>
          </div>
          <div>
            <div className="cl-sidebar-title">CultureLens</div>
            <div className="cl-sidebar-subtitle">Intercultural Competencies Dashboard</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="cl-sidebar-nav" aria-label="Main navigation">
        <span className="cl-sidebar-nav-label">VIEWS</span>
        <ul role="list">
          {navItems.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                className={`cl-nav-item ${activeView === id ? 'cl-nav-item--active' : ''}`}
                onClick={() => onNavigate(id)}
                aria-current={activeView === id ? 'page' : undefined}
              >
                <Icon size={18} strokeWidth={1.75} />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer — Import button */}
      <div className="cl-sidebar-footer">
        <button
          className={`cl-import-btn ${isImported ? 'cl-import-btn--active' : ''}`}
          onClick={onImportClick}
          title="Import Excel data"
        >
          <Upload size={18} strokeWidth={1.75} />
          <span>Import Data</span>
          {isImported && <span className="cl-import-dot" title="Custom data active" />}
        </button>
      </div>
    </aside>
  );
}
