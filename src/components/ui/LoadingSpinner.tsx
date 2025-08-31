'use client'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Loading spinner interface
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'secondary'
  text?: string
  className?: string
}

// Reusable LoadingSpinner component
const LoadingSpinner = ({
  size = 'md',
  variant = 'default',
  text,
  className
}: LoadingSpinnerProps) => {
  // Size classes
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  // Variant classes
  const variantClasses = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    secondary: 'text-gray-400'
  }

  // Spinner classes
  const spinnerClasses = cn(
    'animate-spin',
    sizeClasses[size],
    variantClasses[variant],
    className
  )

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Loader2 className={spinnerClasses} />
      {text && (
        <p className="text-sm text-gray-500 animate-pulse">
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner 