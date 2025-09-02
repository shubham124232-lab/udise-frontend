'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Label } from '@/components/ui/label';
import { dataAPI } from '@/lib/api';
import { HierarchicalFilters as FilterType } from '@/types';

interface HierarchicalFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

export default function HierarchicalFilters({ filters, onFiltersChange }: HierarchicalFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterType>(filters);

  // Get filter options based on current selections
  const { data: filterOptions, isLoading } = useQuery({
    queryKey: ['filterOptions', localFilters.state, localFilters.district, localFilters.block],
    queryFn: () => dataAPI.getFilterOptions({
      state: localFilters.state,
      district: localFilters.district,
      block: localFilters.block,
    }),
    enabled: true,
  });

  // Update parent when local filters change
  useEffect(() => {
    onFiltersChange(localFilters);
  }, [localFilters, onFiltersChange]);

  // Handle state change - reset dependent filters
  const handleStateChange = (state?: string) => {
    const newFilters = { state: state || undefined };
    setLocalFilters(newFilters);
  };

  // Handle district change - reset dependent filters
  const handleDistrictChange = (district?: string) => {
    const newFilters = { 
      state: localFilters.state, 
      district: district || undefined 
    };
    setLocalFilters(newFilters);
  };

  // Handle block change - reset dependent filters
  const handleBlockChange = (block?: string) => {
    const newFilters = { 
      state: localFilters.state, 
      district: localFilters.district, 
      block: block || undefined 
    };
    setLocalFilters(newFilters);
  };

  // Handle village change
  const handleVillageChange = (village?: string) => {
    const newFilters = { 
      ...localFilters, 
      village: village || undefined 
    };
    setLocalFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({});
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-9 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-9 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-9 bg-gray-200 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-9 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* State Filter */}
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select value={localFilters.state ?? undefined} onValueChange={(value) => handleStateChange(value === '__ALL__' ? undefined : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL__">All States</SelectItem>
              {filterOptions?.data?.states?.map((state: string) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District Filter */}
        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Select 
            value={localFilters.district ?? undefined} 
            onValueChange={(value) => handleDistrictChange(value === '__ALL__' ? undefined : value)}
            disabled={!localFilters.state || !filterOptions?.data?.districts?.length}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL__">All Districts</SelectItem>
              {filterOptions?.data?.districts?.map((district: string) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Block Filter */}
        <div className="space-y-2">
          <Label htmlFor="block">Block</Label>
          <Select 
            value={localFilters.block ?? undefined} 
            onValueChange={(value) => handleBlockChange(value === '__ALL__' ? undefined : value)}
            disabled={!localFilters.district || !filterOptions?.data?.blocks?.length}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Block" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL__">All Blocks</SelectItem>
              {filterOptions?.data?.blocks?.map((block: string) => (
                <SelectItem key={block} value={block}>
                  {block}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Village Filter */}
        <div className="space-y-2">
          <Label htmlFor="village">Village</Label>
          <Select 
            value={localFilters.village ?? undefined} 
            onValueChange={(value) => handleVillageChange(value === '__ALL__' ? undefined : value)}
            disabled={!localFilters.block || !filterOptions?.data?.villages?.length}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Village" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__ALL__">All Villages</SelectItem>
              {filterOptions?.data?.villages?.map((village: string) => (
                <SelectItem key={village} value={village}>
                  {village}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {Object.keys(localFilters).length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-gray-600">Active filters:</span>
          {localFilters.state && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              State: {localFilters.state}
            </span>
          )}
          {localFilters.district && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              District: {localFilters.district}
            </span>
          )}
          {localFilters.block && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
              Block: {localFilters.block}
            </span>
          )}
          {localFilters.village && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
              Village: {localFilters.village}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
