// Filter types for the application

export interface Filters {
  searchQuery: string;
  countries: string[];
  types: string[];
  durations: string[];
  languages: string[];
  tuitionRange: [number, number];
}

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}