'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import TransactionForm from './TransactionForm'
import { motion, AnimatePresence } from 'framer-motion'

export function AddTransactionSheet() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-12 w-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 shadow-lg transition hover:bg-emerald-600 sm:h-auto sm:w-auto sm:px-5 sm:py-2.5"
      >
        <Plus className="size-5 text-white" />
        <span className="hidden text-sm font-medium text-white sm:inline">
          Add Transaction
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-zinc-200 bg-white sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="flex justify-center pt-3 sm:hidden">
                <div className="h-1 w-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              </div>

              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
                <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
                  Add Transaction
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="pb-safe max-h-[80vh] overflow-y-auto px-5 py-4">
                <TransactionForm onSuccess={() => setOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
