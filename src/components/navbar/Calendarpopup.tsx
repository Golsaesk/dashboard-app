'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, CalendarCheck } from 'lucide-react'

export type DateRange = {
  from: Date | null
  to: Date | null
}

type Props = {
  open: boolean
  value: DateRange
  onChange: (range: DateRange) => void
  onClose: () => void
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const inRange = (d: Date, from: Date | null, to: Date | null) => {
  if (!from || !to) return false
  return d > from && d < to
}

export default function CalendarPopup({
  open,
  value,
  onChange,
  onClose,
}: Props) {
  const today = new Date(),
    [viewYear, setViewYear] = useState(today.getFullYear()),
    [viewMonth, setViewMonth] = useState(today.getMonth()),
    [selecting, setSelecting] = useState<'from' | 'to'>('from'),
    ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('mousedown', handleOutside)
      document.addEventListener('keydown', handleKey)
    }
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  const prevMonth = () => {
      if (viewMonth === 0) {
        setViewMonth(11)
        setViewYear((y) => y - 1)
      } else setViewMonth((m) => m - 1)
    },
    nextMonth = () => {
      if (viewMonth === 11) {
        setViewMonth(0)
        setViewYear((y) => y + 1)
      } else setViewMonth((m) => m + 1)
    },
    handleDayClick = (day: number) => {
      const clicked = new Date(viewYear, viewMonth, day)
      if (selecting === 'from') {
        onChange({ from: clicked, to: null })
        setSelecting('to')
      } else {
        if (value.from && clicked < value.from) {
          onChange({ from: clicked, to: value.from })
        } else {
          onChange({ from: value.from, to: clicked })
        }
        setSelecting('from')
      }
    },
    clearRange = () => {
      onChange({ from: null, to: null })
      setSelecting('from')
    },
    days = getDaysInMonth(viewYear, viewMonth),
    firstDay = getFirstDayOfMonth(viewYear, viewMonth),
    presets = [
      {
        label: 'This week',
        action: () => {
          const now = new Date()
          const start = new Date(now)
          start.setDate(now.getDate() - now.getDay())
          onChange({ from: start, to: now })
          setSelecting('from')
        },
      },
      {
        label: 'This month',
        action: () => {
          const now = new Date()
          onChange({
            from: new Date(now.getFullYear(), now.getMonth(), 1),
            to: now,
          })
          setSelecting('from')
        },
      },
      {
        label: 'Last 30 days',
        action: () => {
          const now = new Date()
          const from = new Date(now)
          from.setDate(now.getDate() - 30)
          onChange({ from, to: now })
          setSelecting('from')
        },
      },
      {
        label: 'Last 3 months',
        action: () => {
          const now = new Date()
          const from = new Date(now)
          from.setMonth(now.getMonth() - 3)
          onChange({ from, to: now })
          setSelecting('from')
        },
      },
    ]

  const formatShort = (d: Date | null) =>
    d
      ? d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="bg-card border-border absolute top-14 right-0 z-50 w-80 rounded-2xl border shadow-2xl"
        >
          <div className="border-border flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-foreground text-xs font-semibold">
                {value.from && value.to
                  ? `${formatShort(value.from)} → ${formatShort(value.to)}`
                  : selecting === 'from'
                    ? 'Select start date'
                    : 'Select end date'}
              </p>
              {(value.from || value.to) && (
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {selecting === 'to' ? 'Now select end date' : ''}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              {(value.from || value.to) && (
                <button
                  onClick={clearRange}
                  className="text-muted-foreground hover:text-foreground rounded-full p-1 transition"
                >
                  <X size={14} />
                </button>
              )}
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground rounded-full p-1 transition"
              >
                <CalendarCheck size={14} />
              </button>
            </div>
          </div>

          <div className="border-border flex gap-1 border-b px-3 py-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={p.action}
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full px-2 py-1 text-xs transition"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 pt-3 pb-2">
            <button
              onClick={prevMonth}
              className="text-muted-foreground hover:bg-muted rounded-full p-1 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-foreground text-sm font-semibold">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="text-muted-foreground hover:bg-muted rounded-full p-1 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="px-3 pb-4">
            <div className="mb-1 grid grid-cols-7">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="text-muted-foreground py-1 text-center text-xs font-medium"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-0.5">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: days }).map((_, i) => {
                const day = i + 1
                const date = new Date(viewYear, viewMonth, day)
                const isFrom = value.from ? isSameDay(date, value.from) : false
                const isTo = value.to ? isSameDay(date, value.to) : false
                const isInR = inRange(date, value.from, value.to)
                const isToday = isSameDay(date, today)

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`relative flex h-8 w-full items-center justify-center rounded-full text-xs font-medium transition ${isFrom || isTo ? 'bg-primary text-primary-foreground' : ''} ${isInR ? 'bg-primary/10 text-primary rounded-none' : ''} ${!isFrom && !isTo && !isInR ? 'text-foreground hover:bg-muted' : ''} ${isToday && !isFrom && !isTo ? 'ring-primary ring-1' : ''} `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
