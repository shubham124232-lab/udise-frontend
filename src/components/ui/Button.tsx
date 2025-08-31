'use client'
import { ReactNode, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Button variants for different use cases
export interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

// Reusable Button component with hover effects and loading states
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className,
  icon,
  iconPosition = 'left'
}, ref) => {
  // Base button classes
  const baseClasses = [
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transform hover:scale-105 active:scale-95',
    fullWidth ? 'w-full' : ''
  ]

  // Variant-specific classes
  const variantClasses = {
    primary: [
      'bg-blue-600 text-white hover:bg-blue-700',
      'focus:ring-blue-500 shadow-lg hover:shadow-xl',
      'border border-transparent'
    ],
    secondary: [
      'bg-gray-600 text-white hover:bg-gray-700',
      'focus:ring-gray-500 shadow-lg hover:shadow-xl',
      'border border-transparent'
    ],
    outline: [
      'bg-transparent text-gray-700 hover:bg-gray-50',
      'focus:ring-blue-500 border-2 border-gray-300',
      'hover:border-gray-400'
    ],
    ghost: [
      'bg-transparent text-gray-700 hover:bg-gray-100',
      'focus:ring-gray-500 border border-transparent',
      'hover:border-gray-200'
    ],
    danger: [
      'bg-red-600 text-white hover:bg-red-700',
      'focus:ring-red-500 shadow-lg hover:shadow-xl',
      'border border-transparent'
    ]
  }

  // Size-specific classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-base h-12'
  }

  // Combine all classes
  const buttonClasses = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
    >
      {/* Loading spinner */}
      {loading && (
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
      )}
      
      {/* Left icon */}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      
      {/* Button content */}
      <span className="flex items-center">
        {children}
      </span>
      
      {/* Right icon */}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button 