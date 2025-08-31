'use client'
import { DistributionData } from '@/types'
import { BarChart3, PieChart, TrendingUp } from 'lucide-react'

interface DistributionChartsProps {
  data: DistributionData
  isLoading: boolean
}

export default function DistributionCharts({ data, isLoading }: DistributionChartsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="h-32 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Calculate percentages for better visualization
  const calculatePercentage = (count: number, total: number) => {
    return total > 0 ? Math.round((count / total) * 100) : 0
  }

  const getTotalCount = (distribution: any[]) => {
    return distribution.reduce((sum, item) => sum + item.count, 0)
  }

  const managementTotal = getTotalCount(data?.managementTypeDistribution || [])
  const locationTotal = getTotalCount(data?.locationDistribution || [])
  const schoolTypeTotal = getTotalCount(data?.schoolTypeDistribution || [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Management Type Distribution */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Management Type</h3>
        </div>
        
        <div className="space-y-3">
          {data?.managementTypeDistribution?.map((item) => {
            const percentage = calculatePercentage(item.count, managementTotal)
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Total: {managementTotal} schools
          </div>
        </div>
      </div>

      {/* Location Distribution */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <PieChart className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Location</h3>
        </div>
        
        <div className="space-y-3">
          {data?.locationDistribution?.map((item) => {
            const percentage = calculatePercentage(item.count, locationTotal)
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Total: {locationTotal} schools
          </div>
        </div>
      </div>

      {/* School Type Distribution */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">School Type</h3>
        </div>
        
        <div className="space-y-3">
          {data?.schoolTypeDistribution?.map((item) => {
            const percentage = calculatePercentage(item.count, schoolTypeTotal)
            return (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{item.count}</div>
                  <div className="text-xs text-gray-500">{percentage}%</div>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Total: {schoolTypeTotal} schools
          </div>
        </div>
      </div>
    </div>
  )
} 