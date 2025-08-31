'use client'
import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Select option interface
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

// Select component interface
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  variant?: 'default' | 'error' | 'success'
}

// Reusable Select component with custom styling
const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  variant = 'default',
  className,
  ...props
}, ref) => {
  // Variant classes
  const variantClasses = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  }

  // Select wrapper classes
  const selectWrapperClasses = cn(
    'relative',
    'border rounded-lg transition-all duration-200',
    'focus-within:ring-2 focus-within:ring-offset-2',
    variantClasses[variant],
    error ? 'border-red-300' : 'border-gray-300',
    className
  )

  // Select classes
  const selectClasses = cn(
    'w-full px-3 py-2 bg-white',
    'focus:outline-none appearance-none',
    'disabled:bg-gray-50 disabled:cursor-not-allowed',
    'pr-10' // Space for custom chevron
  )

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      {/* Select wrapper */}
      <div className={selectWrapperClasses}>
        {/* Select field */}
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {/* Options */}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom chevron icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* Helper text or error */}
      {(helperText || error) && (
        <p className={cn(
          'text-sm',
          error ? 'text-red-600' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select 