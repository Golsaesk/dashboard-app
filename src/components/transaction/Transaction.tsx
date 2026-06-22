'use client'

import { useMemo, useState } from 'react'
import TransactionForm from './TransactionForm'
import TransactionHistory from './TransactionHistory'
import { useFilterContext } from '@/providers/FilterContext'
import { TransactionListSkeleton } from '@/components/skeleton/Skeleton'
import { useTransactions } from '@/features/finance/hooks/useTransaction'
import {
  ArrowUpDown,
  Plus,
  X,
  CalendarDays,
  SlidersHorizontal,
} from 'lucide-react'

export default function Transaction() {
  const { data: transactions = [], isLoading } = useTransactions(),
    [open, setOpen] = useState(false),
    {
      applyFilters,
      hasActiveFilter,
      hasActiveDateRange,
      dateRange,
      filter,
      setFilter,
    } = useFilterContext(),
    processedItems = useMemo(
      () => applyFilters(transactions),
      [transactions, applyFilters],
    ),
    filterLabel = useMemo(() => {
      const parts: string[] = []
      if (dateRange.from || dateRange.to) {
        const fmt = (d: Date | null) =>
          d
            ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '…'
        parts.push(`${fmt(dateRange.from)} → ${fmt(dateRange.to)}`)
      }
      if (filter.types.length > 0) parts.push(filter.types.join(', '))
      if (filter.amountMin || filter.amountMax)
        parts.push(`$${filter.amountMin || '0'} – $${filter.amountMax || '∞'}`)
      return parts.join(' · ')
    }, [dateRange, filter]),
    isFiltered = hasActiveFilter || hasActiveDateRange,
    cycleSortOrder = () => {
      const next =
        filter.sort === 'latest'
          ? 'earliest'
          : filter.sort === 'earliest'
            ? 'highest'
            : filter.sort === 'highest'
              ? 'lowest'
              : 'latest'
      setFilter({ ...filter, sort: next })
    }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-foreground text-base font-semibold">
            Recent Transactions
          </h2>
          {isFiltered && (
            <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
              {hasActiveDateRange && <CalendarDays size={10} />}
              {hasActiveFilter && <SlidersHorizontal size={10} />}
              <span className="max-w-[200px] truncate">{filterLabel}</span>
              <span className="text-primary ml-1 shrink-0 font-medium">
                · {processedItems.length} result
                {processedItems.length !== 1 ? 's' : ''}
              </span>
            </p>
          )}
        </div>
        <button
          onClick={cycleSortOrder}
          className="bg-muted text-muted-foreground hover:text-foreground flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition"
          title={`Sort: ${filter.sort}`}
        >
          <ArrowUpDown size={12} />
          {filter.sort}
        </button>
      </div>
      {isLoading ? (
        <TransactionListSkeleton />
      ) : processedItems.length === 0 && isFiltered ? (
        <div className="py-10 text-center">
          <p className="text-muted-foreground text-sm">
            No transactions match the current filter.
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            Adjust the date range or filters in the top bar.
          </p>
        </div>
      ) : (
        <TransactionHistory items={processedItems} />
      )}

      {open && (
        <div className="bg-muted/40 rounded-2xl p-4">
          <TransactionForm onSuccess={() => setOpen(false)} />
        </div>
      )}

      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-sm font-medium transition ${
          open
            ? 'bg-muted text-muted-foreground hover:text-foreground'
            : 'bg-primary text-primary-foreground hover:opacity-90'
        }`}
      >
        {open ? <X size={15} /> : <Plus size={15} />}
        {open ? 'Close' : 'Add Transaction'}
      </button>
    </div>
  )
}
