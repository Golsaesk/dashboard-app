'use client'

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from 'react'
import { Transaction } from '@/type/transaction'

export type DateRange = {
  from: Date | null
  to: Date | null
}

export type FilterState = {
  types: ('income' | 'expense' | 'cost')[]
  sort: 'latest' | 'earliest' | 'highest' | 'lowest'
  amountMin: string
  amountMax: string
}

export const DEFAULT_FILTER: FilterState = {
  types: [],
  sort: 'latest',
  amountMin: '',
  amountMax: '',
}

export type FilterContextValue = {
  dateRange: DateRange
  filter: FilterState
  setDateRange: (r: DateRange) => void
  setFilter: (f: FilterState) => void
  resetFilter: () => void
  applyFilters: (transactions: Transaction[]) => Transaction[]
  hasActiveFilter: boolean
  hasActiveDateRange: boolean
}
const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  })
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER)

  const resetFilter = useCallback(() => {
    setFilter(DEFAULT_FILTER)
    setDateRange({ from: null, to: null })
  }, [])

  const applyFilters = useCallback(
    (transactions: Transaction[]): Transaction[] => {
      let data = [...transactions]
      if (dateRange.from || dateRange.to) {
        data = data.filter((t) => {
          if (!t.date) return false
          const d = new Date(t.date)
          if (isNaN(d.getTime())) return false
          const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
          if (dateRange.from) {
            const from = new Date(
              dateRange.from.getFullYear(),
              dateRange.from.getMonth(),
              dateRange.from.getDate(),
            )
            if (day < from) return false
          }
          if (dateRange.to) {
            const to = new Date(
              dateRange.to.getFullYear(),
              dateRange.to.getMonth(),
              dateRange.to.getDate(),
            )
            if (day > to) return false
          }
          return true
        })
      }
      if (filter.types.length > 0) {
        data = data.filter((t) => filter.types.includes(t.type))
      }
      if (filter.amountMin) {
        data = data.filter((t) => t.amount >= Number(filter.amountMin))
      }
      if (filter.amountMax) {
        data = data.filter((t) => t.amount <= Number(filter.amountMax))
      }
      data.sort((a, b) => {
        if (filter.sort === 'latest')
          return (
            new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
          )
        if (filter.sort === 'earliest')
          return (
            new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
          )
        if (filter.sort === 'highest') return b.amount - a.amount
        if (filter.sort === 'lowest') return a.amount - b.amount
        return 0
      })

      return data
    },
    [dateRange, filter],
  )

  const hasActiveFilter =
    filter.types.length > 0 ||
    filter.sort !== 'latest' ||
    !!filter.amountMin ||
    !!filter.amountMax

  const hasActiveDateRange = !!(dateRange.from || dateRange.to)

  const value = useMemo<FilterContextValue>(
    () => ({
      dateRange,
      filter,
      setDateRange,
      setFilter,
      resetFilter,
      applyFilters,
      hasActiveFilter,
      hasActiveDateRange,
    }),
    [
      dateRange,
      filter,
      resetFilter,
      applyFilters,
      hasActiveFilter,
      hasActiveDateRange,
    ],
  )

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  )
}

export function useFilterContext(): FilterContextValue {
  const ctx = useContext(FilterContext)
  if (!ctx)
    throw new Error('useFilterContext must be used inside <FilterProvider>')
  return ctx
}
