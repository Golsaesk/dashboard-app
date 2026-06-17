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
        className="bg-primary text-primary-foreground flex h-14 w-14 items-center justify-center gap-2 rounded-full shadow-lg transition hover:opacity-90 sm:h-auto sm:w-auto sm:rounded-2xl sm:px-5 sm:py-2.5"
      >
        <Plus className="size-6 sm:size-5" />
        <span className="hidden text-sm font-medium sm:inline">
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
              className="bg-card fixed inset-x-0 bottom-0 z-50 rounded-t-3xl sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl"
            >
              <div className="flex justify-center pt-3 sm:hidden">
                <div className="bg-muted h-1 w-10 rounded-full" />
              </div>

              <div className="border-border flex items-center justify-between border-b px-5 py-4">
                <h2 className="text-foreground text-base font-semibold">
                  Add Transaction
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
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
