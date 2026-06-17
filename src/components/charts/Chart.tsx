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
  type: 'income' | 'expense' | 'cost'
}
const tabs: { key: Metric; label: string }[] = [
  { key: 'income', label: 'Income' },
  { key: 'cost', label: 'Expenses' },
  { key: 'balance', label: 'Balance' },
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null

  return (
    <div className="card-shadow-md bg-card rounded-2xl px-4 py-2.5">
      <p className="text-muted-foreground mb-1 text-xs font-medium">{label}</p>
      <p className="text-foreground text-sm font-semibold">
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

  const total = useMemo(
    () => data.reduce((sum, d) => sum + d[metric], 0),
    [data, metric],
  )

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-muted-foreground text-sm">Total Balance</p>
          <p className="text-foreground text-2xl font-bold">
            {formatCurrency(total)}
          </p>
        </div>

        <div className="bg-muted flex gap-1 rounded-full p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setMetric(t.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                metric === t.key
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => formatChartCurrency(v)}
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey={metric}
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
