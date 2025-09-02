// User types
export interface User {
  id: string;
  email: string;
  name: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// School types - matching JD requirements
export interface School {
  _id: string;
  udise_code: string;
  school_name: string;
  state: string;
  district: string;
  block: string;
  village: string;
  management: 'Government' | 'Private Unaided' | 'Aided' | 'Central Government' | 'Other';
  location: 'Rural' | 'Urban';
  school_type: 'Co-Ed' | 'Girls' | 'Boys';
  total_students?: number;
  total_teachers?: number;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface SchoolsResponse {
  success: boolean;
  data: School[];
  pagination: PaginationInfo;
}

// Distribution types - matching JD requirements
export interface DistributionItem {
  label: string;
  count: number;
}

export interface DistributionData {
  success: boolean;
  managementTypeDistribution: DistributionItem[];
  locationDistribution: DistributionItem[];
  schoolTypeDistribution: DistributionItem[];
}

// Filter types
export interface Filters {
  page?: number;
  limit?: number;
  state?: string;
  district?: string;
  block?: string;
  village?: string;
  search?: string;
}

export interface FilterOptions {
  states: string[];
  districts: string[];
  blocks: string[];
  villages: string[];
}

export interface HierarchicalFilters {
  state?: string;
  district?: string;
  block?: string;
  village?: string;
}

// Form types
export interface SchoolFormData {
  udise_code: string;
  school_name: string;
  state: string;
  district: string;
  block: string;
  village: string;
  management: string;
  location: string;
  school_type: string;
  total_students?: number;
  total_teachers?: number;
}

// API Error type
export interface ApiError {
  success: false;
  error: string;
  details?: string[];
}