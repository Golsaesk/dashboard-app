'use client'

import { useMemo, useState } from 'react'
import TransactionForm from './TransactionForm'
import { ArrowUpDown, Plus, X } from 'lucide-react'
import TransactionHistory from './TransactionHistory'
import { TransactionListSkeleton } from '@/components/skeleton/Skeleton'
import { useTransactions } from '@/features/finance/hooks/useTransaction'

type Filter = 'all' | 'income' | 'expense' | 'cost'
type Sort = 'latest' | 'earliest'

const filterLabels: Record<Filter, string> = {
  all: 'All',
  income: 'Income',
  expense: 'Expense',
  cost: 'Cost',
}

export default function Transaction() {
  const { data: transactions = [], isLoading } = useTransactions(),
    [open, setOpen] = useState(false),
    [filter, setFilter] = useState<Filter>('all'),
    [sort, setSort] = useState<Sort>('latest')

  const processedItems = useMemo(() => {
    let data = [...transactions].filter((t) => t?.type)
    if (filter !== 'all') data = data.filter((t) => t.type === filter)
    data.sort((a, b) =>
      sort === 'latest'
        ? new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
        : new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime(),
    )
    return data
  }, [transactions, filter, sort])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
          Latest Spending
        </h2>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
            {(['all', 'income', 'expense', 'cost'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  filter === f
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>

          <button
            onClick={() =>
              setSort((p) => (p === 'latest' ? 'earliest' : 'latest'))
            }
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <TransactionListSkeleton />
      ) : (
        <TransactionHistory items={processedItems} />
      )}

      {open && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <TransactionForm onSuccess={() => setOpen(false)} />
        </div>
      )}

      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition ${
          open
            ? 'border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800'
            : 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400'
        }`}
      >
        {open ? <X size={15} /> : <Plus size={15} />}
        {open ? 'Close' : 'Add Transaction'}
      </button>
    </div>
  )
}
