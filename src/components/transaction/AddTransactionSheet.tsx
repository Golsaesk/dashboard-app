'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TransactionForm from './TransactionForm'

export function AddTransactionSheet() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-14 w-14 items-center justify-center gap-2 rounded-xl bg-emerald-500 shadow-lg transition hover:bg-emerald-600 lg:h-auto lg:w-auto lg:px-5 lg:py-2.5"
      >
        <Plus className="size-5 text-white" />
        <span className="hidden text-sm font-medium text-white lg:inline">
          Add Transaction
        </span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-md -translate-y-1/2 rounded-2xl border border-zinc-200 bg-white sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2 dark:border-zinc-700 dark:bg-zinc-900"
            >
              {/* Header */}
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

              {/* Form */}
              <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
                {/* Date Field */}
            

                <TransactionForm onSuccess={() => setOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
