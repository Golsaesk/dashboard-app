'use client'

import { Trash2 } from 'lucide-react'
import { Transaction } from '@/type/transaction'
import { formatCurrency } from '@/lib/utils/currency'
import { motion, AnimatePresence } from 'framer-motion'
import { useRemoveTransaction } from '@/features/finance/hooks/useTransaction'

type Props = {
  items: Transaction[]
}

const categoryInitials = (value?: string) =>
  value?.slice(0, 2).toUpperCase() || '$$'

const formatDate = (date: unknown) => {
  if (!date) return '—'
  const d = new Date(date as string)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function TransactionHistory({ items }: Props) {
  const { mutate: removeTransaction } = useRemoveTransaction()

  if (!items.length) {
    return (
      <p className="text-muted-foreground py-6 text-center text-sm">
        No transactions yet
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <AnimatePresence>
        {items.map((item) => {
          const isIncome = item.type === 'income'
          const date = formatDate(item.date)

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
              className="group bg-muted/40 hover:bg-muted flex items-center justify-between rounded-2xl p-3.5 transition"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-semibold ${
                    isIncome
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  {item.category ? categoryInitials(item.category) : '$$'}
                </div>

                <div>
                  <p className="text-foreground text-sm font-medium">
                    {item.category}
                  </p>
                  <p className="text-muted-foreground text-xs">{date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <p
                  className={`text-sm font-semibold ${
                    isIncome ? 'text-primary' : 'text-red-500'
                  }`}
                >
                  {isIncome ? '+' : '-'}
                  {formatCurrency(item.amount)}
                </p>

                <button
                  onClick={() => removeTransaction(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 opacity-100 transition hover:bg-red-500/10 sm:opacity-0 sm:group-hover:opacity-100"
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
