import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('udise_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('udise_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const endpoints = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  data: {
    schools: '/data',
    school: (id: string) => `/data/${id}`,
    distribution: '/data/distribution',
    filters: '/data/filters',
  },
} as const

export default api 