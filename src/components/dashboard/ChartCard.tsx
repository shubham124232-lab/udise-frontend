'use client'
import { ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils'

// Chart card interface
export interface ChartCardProps {
  title: string
  icon: ReactNode
  children: ReactNode
  isLoading?: boolean
  error?: string
  className?: string
}

// Beautiful chart card component with loading states
const ChartCard = ({
  title,
  icon,
  children,
  isLoading = false,
  error,
  className
}: ChartCardProps) => {
  return (
    <Card 
      className={cn(
        'transition-all duration-300',
        'hover:shadow-xl hover:-translate-y-1',
        'border-2 hover:border-gray-300',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mr-3">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-gray-900">
          {title}
        </h3>
      </div>
      
      {/* Content */}
      <div className="min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner 
              size="lg" 
              variant="primary" 
              text="Loading chart data..."
            />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-2">⚠️</div>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </Card>
  )
}

export default ChartCard 