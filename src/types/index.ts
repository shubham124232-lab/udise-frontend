// TypeScript type definitions for UDISE Dashboard
// These types work like React props - they define the structure of our data

// School data structure - represents a single school record
export interface School {
  _id: string;                    // Unique identifier from MongoDB
  udise_code: string;            // UDISE code (unique across all schools)
  school_name: string;            // Name of the school
  state: string;                  // State where school is located
  district: string;               // District within the state
  block: string;                  // Block within the district
  village: string;                // Village within the block
  management: 'Government' | 'Private Unaided' | 'Private Aided' | 'Central Government' | 'Other';  // School management type
  location: 'Rural' | 'Urban';   // Rural or Urban location
  school_type: 'Co-Ed' | 'Girls' | 'Boys';  // Type of school based on gender
  establishment_year?: number;    // Year school was established (optional)
  total_students?: number;        // Total number of students (optional)
  total_teachers?: number;        // Total number of teachers (optional)
  infrastructure: {               // Infrastructure details
    has_electricity: boolean;     // Does school have electricity?
    has_drinking_water: boolean;  // Does school have drinking water?
    has_toilets: boolean;         // Does school have toilets?
    has_library: boolean;         // Does school have library?
    has_computer_lab: boolean;    // Does school have computer lab?
  };
  academic_performance: {         // Academic performance metrics
    pass_percentage?: number;     // Pass percentage (optional)
    dropout_rate?: number;        // Dropout rate (optional)
  };
  contact_info: {                 // Contact information
    phone?: string;               // Phone number (optional)
    email?: string;               // Email address (optional)
    website?: string;             // Website URL (optional)
  };
  coordinates: {                  // Geographic coordinates
    latitude?: number;            // Latitude (optional)
    longitude?: number;           // Longitude (optional)
  };
  isActive: boolean;              // Is school currently active?
  createdAt: string;              // When record was created
  updatedAt: string;              // When record was last updated
}

// Filter options for searching and filtering schools
export interface Filters {
  state?: string;                 // Filter by state
  district?: string;              // Filter by district
  block?: string;                 // Filter by block
  village?: string;               // Filter by village
  management?: string;            // Filter by management type
  location?: string;              // Filter by location (Rural/Urban)
  school_type?: string;           // Filter by school type
  search?: string;                // Search term for school name or UDISE code
  page?: number;                  // Current page number for pagination
  limit?: number;                 // Number of records per page
}

// Pagination information for handling large datasets
export interface PaginationInfo {
  currentPage: number;            // Current page number
  totalPages: number;             // Total number of pages
  totalRecords: number;           // Total number of records
  hasNextPage: boolean;           // Is there a next page?
  hasPrevPage: boolean;           // Is there a previous page?
  limit: number;                  // Records per page
}

// API response structure - standard format for all API responses
export interface ApiResponse<T> {
  data: T;                        // The actual data
  message?: string;               // Success/error message (optional)
  error?: string;                 // Error message if something went wrong (optional)
}

// User information for authentication
export interface User {
  id: string;                     // User ID
  email: string;                  // User email address
  role: 'admin' | 'user';        // User role (admin or regular user)
  isActive: boolean;              // Is user account active?
  createdAt: string;              // When account was created
  updatedAt: string;              // When account was last updated
}

// Authentication credentials for login/signup
export interface LoginCredentials {
  email: string;                  // User email
  password: string;               // User password
}

// Signup credentials (extends login with optional role)
export interface SignupCredentials extends LoginCredentials {
  role?: 'admin' | 'user';        // Optional role (defaults to 'user')
}

// Authentication response from API
export interface AuthResponse {
  user: User;                     // User information
  token: string;                  // JWT authentication token
  message: string;                // Success message
}

// Distribution data for charts - shows counts of different categories
export interface DistributionItem {
  label: string;                  // Category label (e.g., "Government", "Rural")
  count: number;                  // Number of schools in this category
}

// Complete distribution data for all chart types
export interface DistributionData {
  managementTypeDistribution: DistributionItem[];  // Management type breakdown
  locationDistribution: DistributionItem[];        // Rural/Urban breakdown
  schoolTypeDistribution: DistributionItem[];      // Co-Ed/Girls/Boys breakdown
}

// Filter options available for dropdown menus
export interface FilterOptions {
  states: string[];               // Available states
  districts: string[];            // Districts for selected state
  blocks: string[];               // Blocks for selected state+district
  villages: string[];             // Villages for selected state+district+block
}

// School form data for creating/editing schools
export interface SchoolFormData {
  udise_code: string;             // UDISE code
  school_name: string;            // School name
  state: string;                  // State
  district: string;               // District
  block: string;                  // Block
  village: string;                // Village
  management: School['management'];  // Management type (using School type)
  location: School['location'];      // Location (using School type)
  school_type: School['school_type']; // School type (using School type)
  establishment_year?: number;    // Establishment year
  total_students?: number;        // Total students
  total_teachers?: number;        // Total teachers
  infrastructure: School['infrastructure'];           // Infrastructure details
  academic_performance: School['academic_performance']; // Academic performance
  contact_info: School['contact_info'];               // Contact information
  coordinates: School['coordinates'];                 // Coordinates
}

// Table column configuration for schools table
export interface TableColumn {
  key: keyof School;              // Property name from School interface
  label: string;                  // Display label for the column
  sortable?: boolean;             // Can this column be sorted?
  width?: string;                 // Column width (CSS value)
}

// School statistics for display
export interface SchoolStats {
  totalStudents: number;          // Total number of students
  totalTeachers: number;          // Total number of teachers
  teacherStudentRatio: string;    // Ratio of students to teachers
}

// API error response
export interface ApiError {
  error: string;                  // Error message
  details?: string[];             // Detailed error information (optional)
}

// Loading state for UI components
export interface LoadingState {
  isLoading: boolean;             // Is data currently loading?
  error: string | null;           // Error message if loading failed
}

// Chart configuration for different chart types
export interface ChartConfig {
  type: 'pie' | 'bar' | 'doughnut';  // Chart type
  data: DistributionItem[];           // Data to display
  title: string;                      // Chart title
  colors?: string[];                  // Custom colors for chart
} 