import { useState, useEffect } from 'react'

// Custom hook for debouncing values (e.g., search input)
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set up timer to update debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Clean up timer on unmount or value change
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
} 