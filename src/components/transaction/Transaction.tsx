'use client'

import { useMemo, useState } from 'react'
import { ArrowUpDown, Plus, X } from 'lucide-react'
import { TransactionForm } from './TransactionForm'
import TransactionHistory from './TransactionHistory'
import { useFinanceStore } from '@/store/financeStore'

type Filter = 'all' | 'income' | 'expense'
type Sort = 'latest' | 'earliest'

const filterLabels: Record<Filter, string> = {
  all: 'All',
  income: 'Income',
  expense: 'Expense',
}

export default function Transaction() {
  const transactions = useFinanceStore((state) => state.transactions)
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [sort, setSort] = useState<Sort>('latest')

  const processedItems = useMemo(() => {
    let data = [...transactions]
    if (filter !== 'all') data = data.filter((t) => t.type === filter)
    data.sort((a, b) => {
      const dateA = new Date(a.date ?? '').getTime()
      const dateB = new Date(b.date ?? '').getTime()
      return sort === 'latest' ? dateB - dateA : dateA - dateB
    })
    return data
  }, [transactions, filter, sort])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
          Latest Spending
        </h2>
        <div className="flex items-center gap-2">
          {/* Filter tabs */}
          <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            {(['all', 'income', 'expense'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  filter === f
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>

          {/* Sort */}
          <button
            onClick={() =>
              setSort((p) => (p === 'latest' ? 'earliest' : 'latest'))
            }
            className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            title={`Sort: ${sort}`}
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      <TransactionHistory items={processedItems} />

      {/* Inline form */}
      {open && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <TransactionForm />
        </div>
      )}

      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
      >
        {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {open ? 'Close' : 'Add Transaction'}
      </button>
    </div>
  )
}
