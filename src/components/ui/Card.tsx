'use client'
import { ReactNode, forwardRef } from 'react'
import { cn } from '@/lib/utils'

// Card component interface
export interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  shadow?: 'sm' | 'md' | 'lg' | 'xl'
  padding?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

// Reusable Card component with hover effects
const Card = forwardRef<HTMLDivElement, CardProps>(({
  children,
  className,
  hover = true,
  shadow = 'md',
  padding = 'md',
  onClick
}, ref) => {
  // Shadow classes
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }

  // Padding classes
  const paddingClasses = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  }

  // Hover effects
  const hoverClasses = hover ? [
    'transition-all duration-300 ease-in-out',
    'hover:shadow-2xl hover:-translate-y-1',
    'hover:border-gray-300'
  ] : []

  // Base card classes
  const cardClasses = cn(
    'bg-white rounded-xl border border-gray-200',
    shadowClasses[shadow],
    paddingClasses[padding],
    hoverClasses,
    onClick ? 'cursor-pointer' : '',
    className
  )

  return (
    <div
      ref={ref}
      className={cardClasses}
      onClick={onClick}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

export default Card 