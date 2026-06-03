'use client'

import { useState } from 'react'
import { useFinanceStore } from '@/store/financeStore'
import { DollarSign, Tag, CalendarDays, Loader2 } from 'lucide-react'

type Field = {
  title: string
  amount: string
  dueDay: string
}

const EMPTY: Field = { title: '', amount: '', dueDay: '' }

export default function AddFixedCost() {
  const [form, setForm] = useState<Field>(EMPTY),
    [submitting, setSubmitting] = useState(false),
    [error, setError] = useState(''),
    addFixedCost = useFinanceStore((state) => state.addFixedCost)

  const set = (key: keyof Field) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const amount = Number(form.amount)
    const dueDay = Number(form.dueDay)

    if (!form.title.trim()) return setError('Title is required')
    if (!amount || amount <= 0) return setError('Enter a valid amount')
    if (!dueDay || dueDay < 1 || dueDay > 31)
      return setError('Due day must be between 1 and 31')

    try {
      setSubmitting(true)
      await addFixedCost({ title: form.title.trim(), amount, due_day: dueDay })
      setForm(EMPTY)
    } catch {
      setError('Failed to add. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
          Add Fixed Cost
        </h2>
        <p className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
          Recurring monthly expenses like rent, subscriptions, etc.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Title
          </label>
          <div className="relative">
            <Tag
              size={14}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="e.g. Rent, Netflix..."
              value={form.title}
              onChange={set('title')}
              className="h-10 w-full rounded-xl border border-zinc-200 bg-white pr-3 pl-8 text-sm text-zinc-900 transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Amount
            </label>
            <div className="relative">
              <DollarSign
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="number"
                placeholder="0"
                min={0}
                value={form.amount}
                onChange={set('amount')}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white pr-3 pl-8 text-sm text-zinc-900 transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-emerald-500"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Due day
            </label>
            <div className="relative">
              <CalendarDays
                size={14}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="number"
                placeholder="1–31"
                min={1}
                max={31}
                value={form.dueDay}
                onChange={set('dueDay')}
                className="h-10 w-full rounded-xl border border-zinc-200 bg-white pr-3 pl-8 text-sm text-zinc-900 transition outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Adding...
            </>
          ) : (
            'Add Fixed Cost'
          )}
        </button>
      </form>
    </div>
  )
}
