'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// Input component interface
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'error' | 'success'
}

// Reusable Input component with focus states
const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
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

  // Input wrapper classes
  const inputWrapperClasses = cn(
    'relative flex items-center',
    'border rounded-lg transition-all duration-200',
    'focus-within:ring-2 focus-within:ring-offset-2',
    variantClasses[variant],
    error ? 'border-red-300' : 'border-gray-300',
    className
  )

  // Input classes
  const inputClasses = cn(
    'w-full px-3 py-2 bg-transparent',
    'focus:outline-none',
    'placeholder:text-gray-400',
    'disabled:bg-gray-50 disabled:cursor-not-allowed',
    leftIcon ? 'pl-10' : '',
    rightIcon ? 'pr-10' : ''
  )

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      {/* Input wrapper */}
      <div className={inputWrapperClasses}>
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        {/* Input field */}
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {/* Right icon */}
        {rightIcon && (
          <div className="absolute right-3 text-gray-400">
            {rightIcon}
          </div>
        )}
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

Input.displayName = 'Input'

export default Input 