'use client'

import { X, Calendar, SlidersHorizontal } from 'lucide-react'
import { useFilterContext } from '@/providers/FilterContext'
import { motion } from 'framer-motion'

export default function ActiveFilterBadge() {
  const {
    dateRange,
    filter,
    resetFilter,
    hasActiveFilter,
    hasActiveDateRange,
  } = useFilterContext()

  const parts: string[] = []

  if (dateRange.from || dateRange.to) {
    const fmt = (d: Date | null) =>
      d
        ? d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '…'
    parts.push(`${fmt(dateRange.from)} → ${fmt(dateRange.to)}`)
  }
  if (filter.types.length > 0) parts.push(filter.types.join(', '))
  if (filter.sort !== 'latest') parts.push(`Sort: ${filter.sort}`)
  if (filter.amountMin || filter.amountMax)
    parts.push(`$${filter.amountMin || '0'} – $${filter.amountMax || '∞'}`)

  if (!hasActiveFilter && !hasActiveDateRange) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className="border-border bg-card flex flex-wrap items-center gap-2 rounded-2xl border px-4 py-2.5"
    >
      <div className="text-primary flex items-center gap-1.5 text-xs font-medium">
        {hasActiveDateRange && <Calendar size={13} />}
        {hasActiveFilter && <SlidersHorizontal size={13} />}
        <span>Filtered view</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {parts.map((p) => (
          <span
            key={p}
            className="bg-primary/8 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            {p}
          </span>
        ))}
      </div>

      <button
        onClick={resetFilter}
        className="text-muted-foreground hover:text-foreground ml-auto flex items-center gap-1 rounded-full px-2 py-1 text-xs transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
      >
        <X size={12} />
        Clear all
      </button>
    </motion.div>
  )
}
