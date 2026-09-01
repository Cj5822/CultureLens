export type ViewType = 'map' | 'analytics' | 'parallelsets' | 'cluster' | 'network' | 'textanalysis';

export interface NavItem {
  id: ViewType;
  label: string;
  icon: string; 
}

export interface FilterState {
  country: string;
  organisationType: string;
  competencyCategory: string;
}
