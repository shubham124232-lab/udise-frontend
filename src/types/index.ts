export interface School {
  _id: string;
  udise_code: string;
  school_name: string;
  state: string;
  district: string;
  block: string;
  village: string;
  management: 'Government' | 'Private Unaided' | 'Private Aided' | 'Central Government' | 'Other';
  location: 'Rural' | 'Urban';
  school_type: 'Co-Ed' | 'Girls' | 'Boys';
  school_category?: string;
  school_status?: string;
  establishment_year?: number;
  total_students?: number;
  total_teachers?: number;
  infrastructure: {
    has_electricity: boolean;
    has_drinking_water: boolean;
    has_toilets: boolean;
    has_library: boolean;
    has_computer_lab: boolean;
  };
  academic_performance: {
    pass_percentage?: number;
    dropout_rate?: number;
  };
  contact_info: {
    phone?: string;
    email?: string;
    website?: string;
  };
  coordinates: {
    latitude?: number;
    longitude?: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Filters {
  state?: string;
  district?: string;
  block?: string;
  village?: string;
  management?: string;
  location?: string;
  school_type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface DistributionItem {
  label: string;
  count: number;
}

export interface DistributionData {
  managementTypeDistribution: DistributionItem[];
  locationDistribution: DistributionItem[];
  schoolTypeDistribution: DistributionItem[];
}

export interface FilterOptions {
  states: string[];
  districts: string[];
  blocks: string[];
  villages: string[];
}

export interface SchoolFormData {
  udise_code: string;
  school_name: string;
  state: string;
  district: string;
  block: string;
  village: string;
  management: School['management'];
  location: School['location'];
  school_type: School['school_type'];
  school_category?: string;
  school_status?: string;
  establishment_year?: number;
  total_students?: number;
  total_teachers?: number;
  infrastructure: School['infrastructure'];
  academic_performance: School['academic_performance'];
  contact_info: School['contact_info'];
  coordinates: School['coordinates'];
}

export interface TableColumn {
  key: keyof School;
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  teacherStudentRatio: string;
}

export interface ApiError {
  error: string;
  details?: string[];
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ChartConfig {
  type: 'pie' | 'bar' | 'doughnut';
  data: DistributionItem[];
  title: string;
  colors?: string[];
} 