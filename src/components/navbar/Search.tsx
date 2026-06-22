'use client'

import { Transaction } from '@/type/transaction'
import { formatCurrency } from '@/lib/utils/currency'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import { Search, X, TrendingUp, TrendingDown, Clock } from 'lucide-react'
import { useTransactions } from '@/features/finance/hooks/useTransaction'

type Props = {
  open: boolean
  onClose: () => void
}

const formatDate = (date: unknown) => {
  if (!date) return '—'
  const d = new Date(date as string)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState(''),
    inputRef = useRef<HTMLInputElement>(null),
    { data: transactions = [] } = useTransactions()

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const results: Transaction[] = query.trim()
    ? transactions.filter(
        (t) =>
          t.category?.toLowerCase().includes(query.toLowerCase()) ||
          t.note?.toLowerCase().includes(query.toLowerCase()) ||
          t.source?.toLowerCase().includes(query.toLowerCase()) ||
          String(t.amount).includes(query),
      )
    : []

  const recent = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
    )
    .slice(0, 5)

  const displayList = query.trim() ? results : recent
  const showingRecent = !query.trim()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="bg-card border-border fixed top-16 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 rounded-2xl border shadow-2xl"
          >
            <div className="border-border flex items-center gap-3 border-b px-4 py-3">
              <Search size={18} className="text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search transactions, categories, notes…"
                className="text-foreground placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="max-h-[360px] overflow-y-auto p-2">
              {displayList.length === 0 && query.trim() ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  No results for &ldquo;{query}&rdquo;
                </p>
              ) : (
                <>
                  {displayList.length > 0 && (
                    <p className="text-muted-foreground mb-1 px-2 pt-1 text-xs font-medium tracking-wide uppercase">
                      {showingRecent ? (
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> Recent
                        </span>
                      ) : (
                        `${results.length} result${results.length !== 1 ? 's' : ''}`
                      )}
                    </p>
                  )}
                  {displayList.map((t) => {
                    const isIncome = t.type === 'income'
                    return (
                      <div
                        key={t.id}
                        className="hover:bg-muted flex items-center justify-between rounded-xl px-3 py-2.5 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                              isIncome
                                ? 'bg-primary/10 text-primary'
                                : 'bg-red-500/10 text-red-500'
                            }`}
                          >
                            {isIncome ? (
                              <TrendingUp size={14} />
                            ) : (
                              <TrendingDown size={14} />
                            )}
                          </div>
                          <div>
                            <p className="text-foreground text-sm leading-tight font-medium">
                              {t.category}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {formatDate(t.date)}
                              {t.note ? ` · ${t.note}` : ''}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            isIncome ? 'text-primary' : 'text-red-500'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {formatCurrency(t.amount)}
                        </span>
                      </div>
                    )
                  })}
                </>
              )}
            </div>

            <div className="border-border text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-xs">
              <span>Press Esc to close</span>
              <span>{transactions.length} total transactions</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
