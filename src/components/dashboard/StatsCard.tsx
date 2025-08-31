'use client'
import { ReactNode } from 'react'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'

// Stats card interface
export interface StatsCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  className?: string
}

// Beautiful stats card component with hover effects
const StatsCard = ({
  title,
  value,
  icon,
  trend,
  variant = 'primary',
  className
}: StatsCardProps) => {
  // Variant-specific colors
  const variantColors = {
    primary: 'text-blue-600 bg-blue-50 border-blue-200',
    secondary: 'text-gray-600 bg-gray-50 border-gray-200',
    success: 'text-green-600 bg-green-50 border-green-200',
    warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    danger: 'text-red-600 bg-red-50 border-red-200'
  }

  // Icon container classes
  const iconClasses = cn(
    'p-3 rounded-lg border transition-all duration-300',
    'group-hover:scale-110 group-hover:shadow-lg',
    variantColors[variant]
  )

  return (
    <Card 
      className={cn(
        'group cursor-pointer transition-all duration-300',
        'hover:shadow-2xl hover:-translate-y-1',
        'border-2 hover:border-gray-300',
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {value}
            </span>
            {trend && (
              <span className={cn(
                'text-sm font-medium',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
        
        {/* Icon */}
        <div className={iconClasses}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

export default StatsCard 