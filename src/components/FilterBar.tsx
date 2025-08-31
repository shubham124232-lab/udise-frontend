'use client'
import { useState, useEffect } from 'react'
import { Filters, FilterOptions } from '@/types'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Filter, Search, X } from 'lucide-react'

interface FilterBarProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
  onSearch: (search: string) => void
  searchTerm: string
}

export default function FilterBar({ filters, onFiltersChange, onSearch, searchTerm }: FilterBarProps) {
  // Fetch filter options based on current selections
  const { data: filterOptions } = useQuery({
    queryKey: ['filterOptions', filters.state, filters.district, filters.block],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.state) params.append('state', filters.state)
      if (filters.district) params.append('district', filters.district)
      if (filters.block) params.append('block', filters.block)
      
      const response = await api.get(`/data/filters?${params.toString()}`)
      return response.data
    }
  })

  // Handle filter changes with cascading logic
  const handleFilterChange = (key: keyof Filters, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value, page: 1 }
    
    // Clear dependent filters when parent changes
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
    
    onFiltersChange(newFilters)
  }

  // Clear all filters
  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 20
    })
    onSearch('')
  }

  // Check if any filters are active
  const hasActiveFilters = filters.state || filters.district || filters.block || filters.village || searchTerm

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Hierarchical Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* State Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <select
            value={filters.state || ''}
            onChange={(e) => handleFilterChange('state', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All States</option>
            {filterOptions?.states?.map((state: string) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
          <select
            value={filters.district || ''}
            onChange={(e) => handleFilterChange('district', e.target.value || undefined)}
            disabled={!filters.state}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">All Districts</option>
            {filterOptions?.districts?.map((district: string) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        {/* Block Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Block</label>
          <select
            value={filters.block || ''}
            onChange={(e) => handleFilterChange('block', e.target.value || undefined)}
            disabled={!filters.district}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">All Blocks</option>
            {filterOptions?.blocks?.map((block: string) => (
              <option key={block} value={block}>{block}</option>
            ))}
          </select>
        </div>

        {/* Village Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Village</label>
          <select
            value={filters.village || ''}
            onChange={(e) => handleFilterChange('village', e.target.value || undefined)}
            disabled={!filters.block}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search schools by name or UDISE code..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.state && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              State: {filters.state}
              <button
                onClick={() => handleFilterChange('state', undefined)}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.district && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              District: {filters.district}
              <button
                onClick={() => handleFilterChange('district', undefined)}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.block && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Block: {filters.block}
              <button
                onClick={() => handleFilterChange('block', undefined)}
                className="ml-1 text-yellow-600 hover:text-yellow-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.village && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Village: {filters.village}
              <button
                onClick={() => handleFilterChange('village', undefined)}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Search: {searchTerm}
              <button
                onClick={() => onSearch('')}
                className="ml-1 text-gray-600 hover:text-gray-800"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
} 