import type { FilterState } from '@/types';

interface TopBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
}

const COUNTRIES = ['All', 'Austria', 'Belgium', 'France', 'Germany', 'Italy', 'Netherlands', 'Poland', 'Portugal', 'Spain', 'Sweden'];
const ORG_TYPES = ['All', 'University', 'Research Institute', 'NGO', 'Museum', 'School', 'Cultural Centre'];
const COMPETENCY_CATEGORIES = ['All', 'Intercultural Awareness', 'Transcultural Skills', 'Language Competency', 'Art Education'];

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="cl-filter">
      <label className="cl-filter-label">{label}:</label>
      <select
        className="cl-filter-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

export function TopBar({ filters, onFilterChange }: TopBarProps) {
  return (
    <header className="cl-topbar">
      <div className="cl-topbar-filters">
        <FilterSelect
          label="Country"
          value={filters.country}
          options={COUNTRIES}
          onChange={(v) => onFilterChange('country', v)}
        />
        <FilterSelect
          label="Organisation Type"
          value={filters.organisationType}
          options={ORG_TYPES}
          onChange={(v) => onFilterChange('organisationType', v)}
        />
        <FilterSelect
          label="Competency Category"
          value={filters.competencyCategory}
          options={COMPETENCY_CATEGORIES}
          onChange={(v) => onFilterChange('competencyCategory', v)}
        />
      </div>
    </header>
  );
}
