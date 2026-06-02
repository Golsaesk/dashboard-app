'use client'

import { useEffect, useState } from 'react'
import { useFinanceStore } from '@/store/financeStore'
import { Trash2, CalendarDays, Plus } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'

export default function FixedCostsList() {
  const [showForm, setShowForm] = useState(false),
    [form, setForm] = useState({ title: '', amount: '', due_day: '' }),
    [submitting, setSubmitting] = useState(false),
    fixedCosts = useFinanceStore((s) => s.fixedCosts),
    fetchFixedCosts = useFinanceStore((s) => s.fetchFixedCosts),
    removeFixedCost = useFinanceStore((s) => s.removeFixedCost),
    addFixedCost = useFinanceStore((s) => s.addFixedCost),
    totalMonthly = fixedCosts.reduce((sum, c) => sum + c.amount, 0)

  useEffect(() => {
    fetchFixedCosts()
  }, [])

  async function handleAdd() {
    if (!form.title || !form.amount || !form.due_day) return
    setSubmitting(true)
    await addFixedCost({
      title: form.title,
      amount: Number(form.amount),
      due_day: Number(form.due_day),
    })
    setForm({ title: '', amount: '', due_day: '' })
    setShowForm(false)
    setSubmitting(false)
  }

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Fixed Costs
          </h2>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Monthly total:{' '}
            <span className="font-medium text-red-500">
              {formatCurrency(totalMonthly)}
            </span>
          </p>
        </div>

        <button
          onClick={() => setShowForm((p) => !p)}
          className="flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {showForm && (
        <div className="mb-4 space-y-3 rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
          <input
            placeholder="Title (e.g. Rent)"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
          />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Amount ($)"
              value={form.amount}
              onChange={(e) =>
                setForm((p) => ({ ...p, amount: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
            />
            <input
              type="number"
              placeholder="Due day"
              min={1}
              max={31}
              value={form.due_day}
              onChange={(e) =>
                setForm((p) => ({ ...p, due_day: e.target.value }))
              }
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-500 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add Fixed Cost'}
          </button>
        </div>
      )}

      {fixedCosts.length === 0 ? (
        <p className="py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No fixed costs yet
        </p>
      ) : (
        <div className="space-y-2">
          {fixedCosts.map((cost) => (
            <div
              key={cost.id}
              className="group flex items-center justify-between rounded-xl border border-zinc-100 bg-white p-3.5 transition hover:border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/40">
                  <CalendarDays
                    size={16}
                    className="text-red-500 dark:text-red-400"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {cost.title}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Due day {cost.due_day} of each month
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-red-500 dark:text-red-400">
                  {formatCurrency(cost.amount)}
                </span>

                <button
                  onClick={() => removeFixedCost(cost.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 text-red-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 dark:border-red-900 dark:text-red-500 dark:hover:bg-red-950/30"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
