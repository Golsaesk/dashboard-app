'use client'

import { X, Check } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type FilterState = {
  types: ('income' | 'expense' | 'cost')[]
  sort: 'latest' | 'earliest' | 'highest' | 'lowest'
  amountMin: string
  amountMax: string
}

type Props = {
  open: boolean
  value: FilterState
  onChange: (f: FilterState) => void
  onClose: () => void
  onReset: () => void
}

const TYPE_OPTIONS: {
  value: FilterState['types'][number]
  label: string
  color: string
}[] = [
  {
    value: 'income',
    label: 'Income',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  {
    value: 'expense',
    label: 'Expense',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
  },
  {
    value: 'cost',
    label: 'Cost',
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
]

const SORT_OPTIONS: { value: FilterState['sort']; label: string }[] = [
  { value: 'latest', label: 'Newest first' },
  { value: 'earliest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest amount' },
  { value: 'lowest', label: 'Lowest amount' },
]

export const DEFAULT_FILTER: FilterState = {
  types: [],
  sort: 'latest',
  amountMin: '',
  amountMax: '',
}

export default function FilterPopup({
  open,
  value,
  onChange,
  onClose,
  onReset,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('mousedown', handler)
      document.addEventListener('keydown', keyHandler)
    }
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [open, onClose])

  const toggleType = (type: FilterState['types'][number]) => {
    const cur = value.types
    onChange({
      ...value,
      types: cur.includes(type)
        ? cur.filter((t) => t !== type)
        : [...cur, type],
    })
  }

  const activeCount =
    value.types.length +
    (value.sort !== 'latest' ? 1 : 0) +
    (value.amountMin ? 1 : 0) +
    (value.amountMax ? 1 : 0)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="bg-card border-border absolute top-14 right-0 z-50 w-72 rounded-2xl border shadow-2xl"
        >
          <div className="border-border flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold">
                Filters
              </span>
              {activeCount > 0 && (
                <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                  {activeCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-4 p-4">
            <div>
              <p className="text-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                Type
              </p>
              <div className="flex gap-2">
                {TYPE_OPTIONS.map((opt) => {
                  const active = value.types.includes(opt.value)
                  return (
                    <button
                      key={opt.value}
                      onClick={() => toggleType(opt.value)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        active
                          ? opt.color + ' border-current'
                          : 'border-border text-muted-foreground hover:border-border/70'
                      }`}
                    >
                      {active && <Check size={10} />}
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <p className="text-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                Sort by
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onChange({ ...value, sort: opt.value })}
                    className={`rounded-xl px-3 py-2 text-xs font-medium transition ${
                      value.sort === opt.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-foreground mb-2 text-xs font-semibold tracking-wide uppercase">
                Amount range
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={value.amountMin}
                  onChange={(e) =>
                    onChange({ ...value, amountMin: e.target.value })
                  }
                  className="border-border bg-muted text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-xl border px-3 py-2 text-xs outline-none"
                />
                <span className="text-muted-foreground text-xs">–</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={value.amountMax}
                  onChange={(e) =>
                    onChange({ ...value, amountMax: e.target.value })
                  }
                  className="border-border bg-muted text-foreground placeholder:text-muted-foreground focus:border-primary w-full rounded-xl border px-3 py-2 text-xs outline-none"
                />
              </div>
            </div>
          </div>
          <div className="border-border flex gap-2 border-t px-4 py-3">
            <button
              onClick={onReset}
              className="text-muted-foreground hover:text-foreground flex-1 rounded-xl py-2 text-xs font-medium transition"
            >
              Reset all
            </button>
            <button
              onClick={onClose}
              className="bg-primary text-primary-foreground flex-1 rounded-xl py-2 text-xs font-medium transition hover:opacity-90"
            >
              Apply
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
