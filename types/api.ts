export interface SearchRequest {
  query: string;
}

export interface SearchResponse {
  search_id: string;
  status: string;
}

export interface CompareRequest {
  material_ids: string[];
}

export interface Material {
  material_id: string;
  formula?: string;
  density?: number;
  band_gap?: number;
  energy_above_hull?: number;
  is_stable?: boolean;
  crystal_system?: string;
  space_group?: string;
  volume?: number;
  [key: string]: any; // Allow other backend-provided properties
}

export interface Evaluation {
  property: string;
  required?: string | number;
  actual?: string | number;
  status: 'PASS' | 'FAIL' | 'INCOMPLETE' | 'AMBIGUOUS' | 'UNAVAILABLE';
  provenance?: 'SOURCE_VALUE' | 'DERIVED_VALUE' | 'AI_INTERPRETATION' | 'UNAVAILABLE';
}

export interface Candidate {
  material_id: string;
  evaluations: Evaluation[];
  material: Material;
}

export interface Requirement {
  property: string;
  condition: string;
  is_ambiguous?: boolean;
}

export interface SearchDetails {
  search_id: string;
  query: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'interrupted' | 'unknown';
  requirements?: Requirement[];
  candidates?: Candidate[];
  critic_status?: string;
  report_available?: boolean;
  events?: any[];
}
