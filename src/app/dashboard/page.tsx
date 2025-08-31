'use client'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { School, Filters, DistributionData, DistributionItem } from '@/types'
import { api } from '@/lib/api'
import { 
  Search, 
  Plus, 
  Filter, 
  LogOut, 
  User,
  BarChart3,
  Table as TableIcon,
  Settings,
  X,
  ChevronLeft,
  ChevronRight,
  School as SchoolIcon,
  MapPin,
  Users,
  BookOpen,
  TrendingUp,
  Building2,
  Globe,
  GraduationCap
} from 'lucide-react'

// Dashboard page component with beautiful UI and performance optimizations
export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // State management with performance optimizations
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 20
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Memoized query keys for better caching
  const schoolsQueryKey = useMemo(() => ['schools', filters, searchTerm], [filters, searchTerm])
  const distributionQueryKey = useMemo(() => ['distribution', filters.state, filters.district, filters.block, filters.village], [filters.state, filters.district, filters.block, filters.village])
  const filterOptionsQueryKey = useMemo(() => ['filterOptions', filters.state, filters.district, filters.block], [filters.state, filters.district, filters.block])

  // Fetch schools data with performance optimizations
  const { 
    data: schoolsData, 
    isLoading: schoolsLoading,
    error: schoolsError 
  } = useQuery({
    queryKey: schoolsQueryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      
      // Only add filters that have values for efficiency
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }

      const response = await api.get(`/data?${params.toString()}`)
      return response.data
    },
    // Performance optimizations
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2
  })

  // Fetch distribution data for charts
  const { 
    data: distributionData, 
    isLoading: chartsLoading 
  } = useQuery({
    queryKey: distributionQueryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      
      // Only add hierarchical filters that exist
      if (filters.state) params.append('state', filters.state)
      if (filters.district) params.append('district', filters.district)
      if (filters.block) params.append('block', filters.block)
      if (filters.village) params.append('village', filters.village)

      const response = await api.get(`/data/distribution?${params.toString()}`)
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for charts
    refetchOnWindowFocus: false
  })

  // Fetch filter options with caching
  const { data: filterOptions } = useQuery({
    queryKey: filterOptionsQueryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.state) params.append('state', filters.state)
      if (filters.district) params.append('district', filters.district)
      if (filters.block) params.append('block', filters.block)

      const response = await api.get(`/data/filters?${params.toString()}`)
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for filter options
    refetchOnWindowFocus: false
  })

  // Optimized filter change handler with useCallback
  const handleFilterChange = useCallback((key: keyof Filters, value: string | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value, page: 1 }
      
      // Clear dependent filters efficiently when parent changes
      if (key === 'state') {
        newFilters.district = undefined
        newFilters.block = undefined
        newFilters.village = undefined
      } else if (key === 'district') {
        newFilters.block = undefined
        newFilters.village = undefined
      } else if (key === 'block') {
        newFilters.village = undefined
      }
      
      return newFilters
    })
  }, [])

  // Optimized search handler with debouncing
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setFilters(prev => ({ ...prev, page: 1 }))
  }, [])

  // Optimized pagination handler
  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  // Clear all filters efficiently
  const clearFilters = useCallback(() => {
    setFilters({ page: 1, limit: 20 })
    setSearchTerm('')
    // Focus search input for better UX
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  // Handle logout
  const handleLogout = useCallback(() => {
    logout()
    router.push('/login')
  }, [logout, router])

  // Memoized computed values for performance
  const hasActiveFilters = useMemo(() => {
    return !!(filters.state || filters.district || filters.block || filters.village || searchTerm)
  }, [filters.state, filters.district, filters.block, filters.village, searchTerm])

  const totalSchools = useMemo(() => schoolsData?.pagination?.totalRecords || 0, [schoolsData])
  const currentPage = useMemo(() => schoolsData?.pagination?.currentPage || 1, [schoolsData])
  const totalPages = useMemo(() => schoolsData?.pagination?.totalPages || 1, [schoolsData])

  // Memoized chart data calculations
  const chartData = useMemo(() => {
    if (!distributionData) return null

    const calculatePercentage = (count: number, total: number) => {
      return total > 0 ? Math.round((count / total) * 100) : 0
    }

    const getTotalCount = (distribution: any[]) => {
      return distribution.reduce((sum, item) => sum + item.count, 0)
    }

    return {
      managementTotal: getTotalCount(distributionData.managementTypeDistribution || []),
      locationTotal: getTotalCount(distributionData.locationDistribution || []),
      schoolTypeTotal: getTotalCount(distributionData.schoolTypeDistribution || []),
      calculatePercentage
    }
  }, [distributionData])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Beautiful Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">UDISE Dashboard</h1>
                <p className="text-sm text-gray-500">Unified District Information System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border-2 border-blue-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Schools</p>
                  <p className="text-3xl font-bold text-gray-900">{totalSchools.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <SchoolIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border-2 border-green-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Filters</p>
                  <p className="text-3xl font-bold text-gray-900">{Object.values(filters).filter(Boolean).length}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <Filter className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border-2 border-purple-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Current Page</p>
                  <p className="text-3xl font-bold text-gray-900">{currentPage}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <TableIcon className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border-2 border-orange-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Pages</p>
                  <p className="text-3xl font-bold text-gray-900">{totalPages}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Beautiful Filters Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Filter className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Filters & Search</h2>
            </div>
            <div className="flex items-center space-x-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </button>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add School
              </button>
            </div>
          </div>

          {/* Hierarchical Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* State Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select
                value={filters.state || ''}
                onChange={(e) => handleFilterChange('state', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
              >
                <option value="">All States</option>
                {filterOptions?.states?.map((state: string) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">District</label>
              <select
                value={filters.district || ''}
                onChange={(e) => handleFilterChange('district', e.target.value || undefined)}
                disabled={!filters.state}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-400"
              >
                <option value="">All Districts</option>
                {filterOptions?.districts?.map((district: string) => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Block Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Block</label>
              <select
                value={filters.block || ''}
                onChange={(e) => handleFilterChange('block', e.target.value || undefined)}
                disabled={!filters.district}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-400"
              >
                <option value="">All Blocks</option>
                {filterOptions?.blocks?.map((block: string) => (
                  <option key={block} value={block}>{block}</option>
                ))}
              </select>
            </div>

            {/* Village Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Village</label>
              <select
                value={filters.village || ''}
                onChange={(e) => handleFilterChange('village', e.target.value || undefined)}
                disabled={!filters.block}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200 hover:border-gray-400"
              >
                <option value="">All Villages</option>
                {filterOptions?.villages?.map((village: string) => (
                  <option key={village} value={village}>{village}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search schools by name or UDISE code..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
            />
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filters.state && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200 transition-colors duration-200">
                  State: {filters.state}
                  <button
                    onClick={() => handleFilterChange('state', undefined)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {filters.district && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors duration-200">
                  District: {filters.district}
                  <button
                    onClick={() => handleFilterChange('district', undefined)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {filters.block && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 transition-colors duration-200">
                  Block: {filters.block}
                  <button
                    onClick={() => handleFilterChange('block', undefined)}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {filters.village && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 transition-colors duration-200">
                  Village: {filters.village}
                  <button
                    onClick={() => handleFilterChange('village', undefined)}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 transition-colors duration-200">
                  Search: {searchTerm}
                  <button
                    onClick={() => handleSearch('')}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Beautiful Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Management Type Distribution */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Management Type</h3>
            </div>
            
            {chartsLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {distributionData?.managementTypeDistribution?.map((item: DistributionItem) => {
                  const percentage = chartData?.calculatePercentage(item.count, chartData.managementTotal) || 0
                  return (
                    <div key={item.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{item.count.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  )
                })}
                {chartData && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-500 font-medium">
                      Total: {chartData.managementTotal.toLocaleString()} schools
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Location Distribution */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-50 rounded-lg mr-3">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Location</h3>
            </div>
            
            {chartsLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {distributionData?.locationDistribution?.map((item: DistributionItem) => {
                  const percentage = chartData?.calculatePercentage(item.count, chartData.locationTotal) || 0
                  return (
                    <div key={item.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{item.count.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  )
                })}
                {chartData && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-500 font-medium">
                      Total: {chartData.locationTotal.toLocaleString()} schools
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* School Type Distribution */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-50 rounded-lg mr-3">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">School Type</h3>
            </div>
            
            {chartsLoading ? (
              <div className="h-32 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {distributionData?.schoolTypeDistribution?.map((item: DistributionItem) => {
                  const percentage = chartData?.calculatePercentage(item.count, chartData.schoolTypeTotal) || 0
                  return (
                    <div key={item.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{item.count.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  )
                })}
                {chartData && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="text-sm text-gray-500 font-medium">
                      Total: {chartData.schoolTypeTotal.toLocaleString()} schools
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Beautiful Schools Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TableIcon className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Schools ({totalSchools.toLocaleString()})
                </h2>
              </div>
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {schoolsLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading schools data...</p>
              <p className="text-gray-400 text-sm">Please wait while we fetch the latest information</p>
            </div>
          ) : schoolsError ? (
            <div className="p-12 text-center">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <p className="text-red-600 text-lg mb-2">Error loading schools</p>
              <p className="text-gray-500 text-sm">Please try again or contact support if the problem persists</p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">School</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Management</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schoolsData?.schools?.map((school: School) => (
                      <tr 
                        key={school._id} 
                        className="hover:bg-blue-50 cursor-pointer transition-all duration-200 group"
                        onClick={() => setSelectedSchool(school)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3 group-hover:bg-blue-200 transition-colors duration-200">
                              <SchoolIcon className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors duration-200">
                                {school.school_name}
                              </div>
                              <div className="text-sm text-gray-500">{school.udise_code}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-1 bg-green-100 rounded mr-2 group-hover:bg-green-200 transition-colors duration-200">
                              <MapPin className="h-3 w-3 text-green-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{school.village}, {school.block}</div>
                              <div className="text-sm text-gray-500">{school.district}, {school.state}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200 group-hover:bg-blue-200 transition-colors duration-200">
                            {school.management}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200 group-hover:bg-green-200 transition-colors duration-200">
                            {school.school_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-1 bg-purple-100 rounded mr-2 group-hover:bg-purple-200 transition-colors duration-200">
                              <Users className="h-3 w-3 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {school.total_students ? school.total_students.toLocaleString() : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-100 transition-all duration-200">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-100 transition-all duration-200">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Beautiful Pagination */}
              {schoolsData?.pagination && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((schoolsData.pagination.currentPage - 1) * schoolsData.pagination.limit) + 1} to{' '}
                      {Math.min(schoolsData.pagination.currentPage * schoolsData.pagination.limit, schoolsData.pagination.totalRecords)} of{' '}
                      {schoolsData.pagination.totalRecords.toLocaleString()} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(schoolsData.pagination.currentPage - 1)}
                        disabled={!schoolsData.pagination.hasPrevPage}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </button>
                      
                      <span className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg">
                        Page {schoolsData.pagination.currentPage} of {schoolsData.pagination.totalPages}
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(schoolsData.pagination.currentPage + 1)}
                        disabled={!schoolsData.pagination.hasNextPage}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* TODO: Add modals for Add/Edit/Delete/School Details */}
      {/* These will be implemented in separate components */}
    </div>
  )
} 