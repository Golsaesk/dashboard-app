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
        <h2 className="text-foreground text-base font-semibold">
          Recent Transactions
        </h2>

        <div className="flex items-center gap-2">
          <div className="bg-muted flex rounded-full p-1">
            {(['all', 'income', 'expense', 'cost'] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  filter === f
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
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
            className="bg-muted text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full transition"
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
