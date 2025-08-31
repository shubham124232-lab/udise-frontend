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

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 20
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  const schoolsQueryKey = useMemo(() => ['schools', filters, searchTerm], [filters, searchTerm])
  const distributionQueryKey = useMemo(() => ['distribution', filters.state, filters.district, filters.block, filters.village], [filters.state, filters.district, filters.block, filters.village])
  const filterOptionsQueryKey = useMemo(() => ['filterOptions', filters.state, filters.district, filters.block], [filters.state, filters.district, filters.block])

  const { 
    data: schoolsData, 
    isLoading: schoolsLoading,
    error: schoolsError 
  } = useQuery({
    queryKey: schoolsQueryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }

      const response = await api.get(`/data?${params.toString()}`)
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2
  })

  const { 
    data: distributionData, 
    isLoading: chartsLoading 
  } = useQuery({
    queryKey: distributionQueryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (filters.state) params.append('state', filters.state)
      if (filters.district) params.append('district', filters.district)
      if (filters.block) params.append('block', filters.block)
      if (filters.village) params.append('village', filters.village)

      const response = await api.get(`/data/distribution?${params.toString()}`)
      return response.data
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  })

  const { 
    data: filterOptions 
  } = useQuery({
    queryKey: filterOptionsQueryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      
      if (filters.state) params.append('state', filters.state)
      if (filters.district) params.append('district', filters.district)
      if (filters.block) params.append('block', filters.block)

      const response = await api.get(`/data/filters?${params.toString()}`)
      return response.data
    },
    staleTime: 10 * 60 * 1000
  })

  const totalSchools = useMemo(() => schoolsData?.pagination?.totalRecords || 0, [schoolsData])
  const currentPage = useMemo(() => schoolsData?.pagination?.currentPage || 1, [schoolsData])
  const totalPages = useMemo(() => schoolsData?.pagination?.totalPages || 1, [schoolsData])

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

  const handleLogout = useCallback(() => {
    logout()
    router.push('/login')
  }, [logout, router])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    setFilters(prev => ({ ...prev, page: 1 }))
  }, [])

  const handleFilterChange = useCallback((key: keyof Filters, value: string | number) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value, page: 1 }
      
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

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  const handlePageSizeChange = useCallback((limit: number) => {
    setFilters(prev => ({ ...prev, limit, page: 1 }))
  }, [])

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Schools Data</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add School
            </button>
          </div>

          <div className="mb-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filters.state || ''}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All States</option>
                  {filterOptions?.states?.map((state: string) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <select
                  value={filters.district || ''}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={!filters.state}
                >
                  <option value="">All Districts</option>
                  {filterOptions?.districts?.map((district: string) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                <select
                  value={filters.block || ''}
                  onChange={(e) => handleFilterChange('block', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={!filters.district}
                >
                  <option value="">All Blocks</option>
                  {filterOptions?.blocks?.map((block: string) => (
                    <option key={block} value={block}>{block}</option>
                  ))}
                </select>
                <select
                  value={filters.village || ''}
                  onChange={(e) => handleFilterChange('village', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={!filters.block}
                >
                  <option value="">All Villages</option>
                  {filterOptions?.villages?.map((village: string) => (
                    <option key={village} value={village}>{village}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {schoolsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : schoolsError ? (
            <div className="text-center text-red-600 py-8">
              Error loading schools data
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schoolsData?.schools?.map((school: School) => (
                      <tr key={school._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedSchool(school)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{school.school_name}</div>
                            <div className="text-sm text-gray-500">{school.udise_code}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{school.village}, {school.block}</div>
                          <div className="text-sm text-gray-500">{school.district}, {school.state}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {school.management}
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mt-1">
                              {school.location}
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 mt-1">
                              {school.school_type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
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

              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Show</span>
                  <select
                    value={filters.limit}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-sm text-gray-700">entries</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 