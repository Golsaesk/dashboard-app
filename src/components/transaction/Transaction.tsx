'use client'

import { useMemo, useState } from 'react'
import { ArrowUpDown, Plus } from 'lucide-react'
import { TransactionForm } from './TransactionForm'
import TransactionHistory from './TransactionHistory'
import { useFinanceStore } from '@/store/financeStore'

type Filter = 'all' | 'income' | 'expense'

type Sort = 'latest' | 'earliest'

export default function Transaction() {
  const transactions = useFinanceStore((state) => state.transactions)

  const [open, setOpen] = useState(false)

  const [filter, setFilter] = useState<Filter>('all')

  const [sort, setSort] = useState<Sort>('latest')

  const processedItems = useMemo(() => {
    let data = [...transactions]

    if (filter !== 'all') {
      data = data.filter((t) => t.type === filter)
    }

    data.sort((a, b) => {
      const dateA = new Date(a.date ?? '').getTime()

      const dateB = new Date(b.date ?? '').getTime()

      return sort === 'latest' ? dateB - dateA : dateA - dateB
    })

    return data
  }, [transactions, filter, sort])

  const handleToggleSort = () => {
    setSort((prev) => (prev === 'latest' ? 'earliest' : 'latest'))

    setFilter((prev) => {
      if (prev === 'all') return 'income'

      if (prev === 'income') return 'expense'

      return 'all'
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Latest Spending</h2>

        <button
          onClick={handleToggleSort}
          className="rounded-2xl border border-zinc-200 p-2 text-zinc-500 transition-all duration-300 hover:scale-110 hover:border-zinc-300 hover:text-zinc-700 active:scale-95"
          title={`Sort: ${sort} | Filter: ${filter}`}
        >
          <ArrowUpDown className="h-5 w-5" />
        </button>
      </div>

      <TransactionHistory items={processedItems} />

      {open && (
        <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm">
          <TransactionForm />
        </div>
      )}

      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0AA165] px-4 py-4 font-semibold text-white transition hover:opacity-90"
      >
        <Plus className="h-4 w-4" />

        {open ? 'Close' : 'Add Transaction'}
      </button>
    </div>
  )
}
