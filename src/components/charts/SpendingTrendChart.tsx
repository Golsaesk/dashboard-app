'use client'

import { useMemo, useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Range = '6M' | '1Y' | 'ALL'

type Transaction = {
  id: string
  amount: number
  category: string
  type: 'income' | 'expense' | 'cost'
  description?: string
  created_at: number | Date
}

export default function SpendingTrendChart({
  transactions,
}: {
  transactions: Transaction[]
}) {
  const [range, setRange] = useState<Range>('6M')

  const data = useMemo(() => {
    if (!transactions?.length) return []

    const map: Record<
      string,
      { month: string; income: number; expense: number; date: Date }
    > = {}

    for (const t of transactions) {
      const rawDate = t.created_at
      if (!rawDate) continue

      const date = new Date(rawDate)
      if (isNaN(date.getTime())) continue

      const year = date.getFullYear()
      const monthIndex = date.getMonth()
      const monthLabel = date.toLocaleString('en-US', { month: 'short' })

      const key = `${year}-${monthIndex}`

      if (!map[key]) {
        map[key] = {
          month: `${monthLabel} ${year}`,
          income: 0,
          expense: 0,
          date,
        }
      }

      const amount = Number(t.amount) || 0

      if (t.type === 'income') {
        map[key].income += amount
      } else {
        map[key].expense += amount
      }
    }

    let result = Object.values(map).sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    )

    if (range === '6M') result = result.slice(-6)
    if (range === '1Y') result = result.slice(-12)

    return result
  }, [transactions, range])

  return (
    <div className="space-y-3">
      <div className="flex gap-2 text-xs">
        {(['6M', '1Y', 'ALL'] as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`rounded px-2 py-1 ${
              range === r
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Area
              dataKey="income"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.2}
            />

            <Area
              dataKey="expense"
              stroke="#f87171"
              fill="#f87171"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
