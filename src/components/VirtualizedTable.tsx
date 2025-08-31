'use client'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { School } from '@/types'
import { Edit, Trash2, Eye } from 'lucide-react'

interface VirtualizedTableProps {
  schools: School[]
  onEdit: (school: School) => void
  onDelete: (school: School) => void
  onView: (school: School) => void
  height?: number
  rowHeight?: number
}

export default function VirtualizedTable({
  schools,
  onEdit,
  onDelete,
  onView,
  height = 600,
  rowHeight = 60
}: VirtualizedTableProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate visible range for virtualization
  const visibleCount = Math.ceil(height / rowHeight)
  const startIndex = Math.floor(scrollTop / rowHeight)
  const endIndex = Math.min(startIndex + visibleCount + 1, schools.length)

  // Memoized visible schools for performance
  const visibleSchools = useMemo(() => {
    return schools.slice(startIndex, endIndex)
  }, [schools, startIndex, endIndex])

  // Handle scroll with throttling for performance
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    setScrollTop(target.scrollTop)
  }, [])

  // Calculate total height for scrollbar
  const totalHeight = schools.length * rowHeight

  // Memoized row renderer for performance
  const renderRow = useCallback((school: School, index: number) => {
    const actualIndex = startIndex + index
    const top = actualIndex * rowHeight

    return (
      <div
        key={school._id}
        className="absolute left-0 right-0 flex items-center px-6 py-4 border-b border-gray-100 hover:bg-gray-50"
        style={{ top, height: rowHeight }}
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate">{school.school_name}</div>
          <div className="text-sm text-gray-500 truncate">{school.udise_code}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-900 truncate">{school.village}, {school.block}</div>
          <div className="text-sm text-gray-500 truncate">{school.district}, {school.state}</div>
        </div>
        <div className="w-32">
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {school.management}
          </span>
        </div>
        <div className="w-24">
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            {school.school_type}
          </span>
        </div>
        <div className="w-20 text-sm text-gray-900">
          {school.total_students || 'N/A'}
        </div>
        <div className="w-32 flex space-x-2">
          <button
            onClick={() => onView(school)}
            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(school)}
            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
            title="Edit School"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(school)}
            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
            title="Delete School"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    )
  }, [startIndex, rowHeight, onView, onEdit, onDelete])

  // Memoized table header
  const tableHeader = useMemo(() => (
    <div className="sticky top-0 z-10 bg-gray-50 px-6 py-3 border-b border-gray-200">
      <div className="flex items-center">
        <div className="flex-1 min-w-0 font-medium text-xs text-gray-500 uppercase tracking-wider">School</div>
        <div className="flex-1 min-w-0 font-medium text-xs text-gray-500 uppercase tracking-wider">Location</div>
        <div className="w-32 font-medium text-xs text-gray-500 uppercase tracking-wider">Management</div>
        <div className="w-24 font-medium text-xs text-gray-500 uppercase tracking-wider">Type</div>
        <div className="w-20 font-medium text-xs text-gray-500 uppercase tracking-wider">Students</div>
        <div className="w-32 font-medium text-xs text-gray-500 uppercase tracking-wider">Actions</div>
      </div>
    </div>
  ), [])

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {tableHeader}
      
      <div
        ref={containerRef}
        className="relative overflow-auto"
        style={{ height }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleSchools.map((school, index) => renderRow(school, index))}
        </div>
      </div>
    </div>
  )
} 