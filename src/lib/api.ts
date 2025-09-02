import axios from 'axios';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  SchoolsResponse, 
  DistributionData,
  FilterOptions,
  School,
  SchoolFormData,
  ApiResponse,
  HierarchicalFilters
} from '@/types';

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API - matching JD requirements
export const authAPI = {
  // POST /api/auth/login → Login with email & password → return JWT
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // POST /api/auth/signup → Register user (store hashed password)
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  }
};

// Data API - matching JD requirements exactly
export const dataAPI = {
  // GET /api/data - Get School Records (with Hierarchical Filters)
  getSchools: async (params: HierarchicalFilters & { page?: number; limit?: number }): Promise<SchoolsResponse> => {
    // Filter out undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );
    const response = await api.get('/api/data', { params: cleanParams });
    return response.data;
  },

  // POST /api/data - Add New Record
  createSchool: async (data: SchoolFormData): Promise<ApiResponse<School>> => {
    const response = await api.post('/api/data', data);
    return response.data;
  },

  // PUT /api/data/:id - Update Record
  updateSchool: async (id: string, data: Partial<SchoolFormData>): Promise<ApiResponse<School>> => {
    const response = await api.put(`/api/data/${id}`, data);
    return response.data;
  },

  // DELETE /api/data/:id - Delete Record
  deleteSchool: async (id: string): Promise<ApiResponse<School>> => {
    const response = await api.delete(`/api/data/${id}`);
    return response.data;
  },

  // GET /api/data/distribution - Dynamic Distribution Data
  getDistribution: async (filters: HierarchicalFilters): Promise<DistributionData> => {
    // Filter out undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );
    const response = await api.get('/api/data/distribution', { params: cleanFilters });
    return response.data;
  },

  // GET /api/data/filters - Get filter options for hierarchical dropdowns
  getFilterOptions: async (filters: Partial<HierarchicalFilters> = {}): Promise<ApiResponse<FilterOptions>> => {
    // Filter out undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );
    const response = await api.get('/api/data/filters', { params: cleanFilters });
    return response.data;
  }
};

export default api;