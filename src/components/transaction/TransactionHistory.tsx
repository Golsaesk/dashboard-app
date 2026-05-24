'use client'

import { Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transaction } from '@/type/transaction'
import { useFinanceStore } from '@/store/financeStore'

type Props = {
  items: Transaction[]
}

export default function TransactionHistory({ items }: Props) {
  const removeTransaction = useFinanceStore((state) => state.removeTransaction)

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence>
        {items.map((item) => {
          const isIncome = item.type === 'income'

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: -40,
                scale: 0.9,
                transition: {
                  duration: 0.25,
                },
              }}
              transition={{
                duration: 0.3,
              }}
              className="group relative flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-zinc-200 transition-transform duration-300 group-hover:scale-110" />

                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {item.name}
                  </p>

                  <p className="text-xs text-zinc-500">{item.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p
                  className={`text-sm font-semibold ${
                    isIncome ? 'text-[#0AA165]' : 'text-red-500'
                  }`}
                >
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(item.amount)}
                </p>

                <button
                  onClick={() => removeTransaction(item.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition-all duration-300 hover:scale-110 hover:bg-red-100 active:scale-95"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
