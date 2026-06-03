'use client'

import { Trash2 } from 'lucide-react'
import { Transaction } from '@/type/transaction'
import { formatCurrency } from '@/lib/utils/currency'
import { motion, AnimatePresence } from 'framer-motion'
import { useFinanceStore } from '@/store/financeStore'
import { INCOME_CATEGORIES, OUTCOME_CATEGORIES } from '@/config/category.config'

type Props = {
  items: Transaction[]
}

const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...OUTCOME_CATEGORIES]

const getCategoryLabel = (value?: string) => {
  if (!value) return 'Uncategorized'

  const normalized = value.trim().toLowerCase()

  const found = ALL_CATEGORIES.find((c) => c.value.toLowerCase() === normalized)

  return found?.label || 'Uncategorized'
}

const categoryInitials = (value?: string) =>
  value?.slice(0, 2).toUpperCase() || '$$'

const formatDate = (date: unknown) => {
  if (!date) return '—'

  const d = new Date(date as any)
  if (isNaN(d.getTime())) return '—'

  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function TransactionHistory({ items }: Props) {
  const removeTransaction = useFinanceStore((state) => state.removeTransaction)

  if (!items.length) {
    return (
      <p className="py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
        No transactions yet
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {items.map((item) => {
          const isIncome = item.type === 'income'
          // const categoryLabel = getCategoryLabel(item.category)
          const date = formatDate(item.date)
          console.log('ITEM:', item)
          console.log('CATEGORY:', item.category)
          console.log('DATE:', item.date)

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: -30,
                scale: 0.95,
                transition: { duration: 0.2 },
              }}
              transition={{ duration: 0.25 }}
              className="group flex items-center justify-between rounded-xl border border-zinc-100 bg-white p-3.5 transition hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold ${
                    isIncome
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400'
                  }`}
                >
                  {item.category ? categoryInitials(item.category) : '$$'}
                </div>

                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {item.category}
                  </p>

                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p
                  className={`text-sm font-semibold ${
                    isIncome
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(item.amount)}
                </p>

                <button
                  onClick={() => removeTransaction(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-400 opacity-100 transition hover:bg-red-50 sm:opacity-0 sm:group-hover:opacity-100 dark:border-red-900 dark:text-red-500 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
