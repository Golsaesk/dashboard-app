'use client'

import { useMemo, useState } from 'react'
import TransactionForm from './TransactionForm'
import { ArrowUpDown, Plus, X } from 'lucide-react'
import TransactionHistory from './TransactionHistory'
import { useFinanceStore } from '@/store/financeStore'

type Filter = 'all' | 'income' | 'outcome'
type Sort = 'latest' | 'earliest'

const filterLabels: Record<Filter, string> = {
  all: 'All',
  income: 'Income',
  outcome: 'Outcome',
}

export default function Transaction() {
  const transactions = useFinanceStore((state) => state.transactions),
    [open, setOpen] = useState(false),
    [filter, setFilter] = useState<Filter>('all'),
    [sort, setSort] = useState<Sort>('latest')

  const processedItems = useMemo(() => {
    let data = [...transactions]

    data = data.filter((t) => t?.type)

    if (filter !== 'all') {
      data = data.filter((t) => t.type === filter)
    }

    data.sort((a, b) => {
      return sort === 'latest'
        ? new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime()
        : new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime()
    })

    return data
  }, [transactions, filter, sort])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2>Latest Spending</h2>

        <div className="flex gap-2">
          {(['all', 'income', 'outcome'] as Filter[]).map((f) => (
            <button key={f} onClick={() => setFilter(f)}>
              {filterLabels[f]}
            </button>
          ))}

          <button
            onClick={() =>
              setSort((p) => (p === 'latest' ? 'earliest' : 'latest'))
            }
          >
            <ArrowUpDown />
          </button>
        </div>
      </div>

      <TransactionHistory items={processedItems} />

      {open && (
        <div>
          <TransactionForm />
        </div>
      )}

      <button onClick={() => setOpen((p) => !p)}>
        {open ? <X /> : <Plus />}
        {open ? 'Close' : 'Add Transaction'}
      </button>
    </div>
  )
}
