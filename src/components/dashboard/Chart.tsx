'use client'

import { useMemo, useState } from 'react'
import { useFinanceStore } from '@/store/financeStore'
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

const tabs: { key: Metric; label: string }[] = [
  { key: 'cost', label: 'Cost' },
  { key: 'income', label: 'Income' },
  { key: 'balance', label: 'Balance' },
]

export default function FinanceChart() {
  const { transactions } = useFinanceStore(),
    [metric, setMetric] = useState<Metric>('cost'),
    data = useMemo(() => {
      const map: Record<string, any> = {}
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
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setMetric(t.key)}
            className={`rounded-2xl border px-4 py-2 text-sm transition ${
              metric === t.key
                ? 'border-[#0AA165] bg-[#0AA165] text-white'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey={metric}
              stroke="#0AA165"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
