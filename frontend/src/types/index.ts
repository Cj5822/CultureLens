export type ViewType = 'map' | 'analytics' | 'cluster' | 'network' | 'textanalysis';

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
