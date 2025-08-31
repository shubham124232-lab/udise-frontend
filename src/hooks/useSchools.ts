import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { School, Filters } from '@/types'
import { api } from '@/lib/api'

// Custom hook for schools data management
export function useSchools() {
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    limit: 20
  })
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  // Memoized query key for better caching
  const queryKey = useMemo(() => ['schools', filters, searchTerm], [filters, searchTerm])

  // Fetch schools with optimized query
  const {
    data: schoolsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams()
      
      // Only add filters that have values
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString())
      })
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }

      const response = await api.get(`/data?${params.toString()}`)
      return response.data
    },
    // Optimize for performance
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2
  })

  // Fetch distribution data for charts
  const { data: distributionData, isLoading: chartsLoading } = useQuery({
    queryKey: ['distribution', filters.state, filters.district, filters.block, filters.village],
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
    queryKey: ['filterOptions', filters.state, filters.district, filters.block],
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

  // Optimized filter change handler
  const handleFilterChange = useCallback((key: keyof Filters, value: string | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value, page: 1 }
      
      // Clear dependent filters efficiently
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

  // Pagination handler
  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({ page: 1, limit: 20 })
    setSearchTerm('')
  }, [])

  // Memoized computed values
  const hasActiveFilters = useMemo(() => {
    return !!(filters.state || filters.district || filters.block || filters.village || searchTerm)
  }, [filters.state, filters.district, filters.block, filters.village, searchTerm])

  const totalSchools = useMemo(() => schoolsData?.pagination?.totalRecords || 0, [schoolsData])
  const currentPage = useMemo(() => schoolsData?.pagination?.currentPage || 1, [schoolsData])
  const totalPages = useMemo(() => schoolsData?.pagination?.totalPages || 1, [schoolsData])

  return {
    // Data
    schools: schoolsData?.schools || [],
    pagination: schoolsData?.pagination,
    distributionData,
    filterOptions,
    
    // State
    filters,
    searchTerm,
    hasActiveFilters,
    
    // Loading states
    isLoading,
    chartsLoading,
    
    // Computed values
    totalSchools,
    currentPage,
    totalPages,
    
    // Actions
    handleFilterChange,
    handleSearch,
    handlePageChange,
    clearFilters,
    refetch,
    
    // Error handling
    error
  }
} 