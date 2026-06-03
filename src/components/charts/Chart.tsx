'use client'

import { useMemo, useState } from 'react'
import { formatChartCurrency, formatCurrency } from '@/lib/utils/currency'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

type Metric = 'cost' | 'income' | 'balance'
type Transaction = {
  date?: string
  amount?: number
  type: 'income' | 'outcome'
}
const tabs: { key: Metric; label: string }[] = [
  { key: 'income', label: 'Income' },
  { key: 'cost', label: 'Expenses' },
  { key: 'balance', label: 'Balance' },
]

const metricColors: Record<Metric, string> = {
  income: '#10b981',
  cost: '#f43f5e',
  balance: '#6366f1',
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <p className="mb-1 text-xs font-medium text-zinc-400">{label}</p>
      <p className="text-sm font-semibold text-zinc-900 dark:text-white">
        {formatCurrency(payload[0].value ?? 0)}
      </p>
    </div>
  )
}

export default function FinanceChart({
  transactions,
}: {
  transactions: Transaction[]
}) {
  const [metric, setMetric] = useState<Metric>('income')

  const data = useMemo(() => {
    const map: Record<
      string,
      { month: string; cost: number; income: number; balance: number }
    > = {}

    for (const t of transactions) {
      if (!t?.date) continue

      const d = new Date(t.date)
      if (isNaN(d.getTime())) continue

      const month = d.toLocaleString('en-US', { month: 'short' })

      if (!map[month]) {
        map[month] = { month, cost: 0, income: 0, balance: 0 }
      }

      const amount = t.amount ?? 0

      if (t.type === 'income') {
        map[month].income += amount
        map[month].balance += amount
      } else {
        map[month].cost += amount
        map[month].balance -= amount
      }
    }

    return Object.values(map)
  }, [transactions])

  return (
    <div className="space-y-5">
      <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setMetric(t.key)}
            className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              metric === t.key
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-zinc-100 dark:text-zinc-800"
              vertical={false}
            />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => formatChartCurrency(v)} />
            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey={metric}
              stroke={metricColors[metric]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
