'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFinanceStore } from '@/store/financeStore'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Range = '6M' | '1Y' | 'ALL'

export default function SpendingTrendChart() {
  const transactions = useFinanceStore((s) => s.transactions)
  const fetchTransactions = useFinanceStore((s) => s.fetchTransactions)
  const loading = useFinanceStore((s) => s.loading)

  const [range, setRange] = useState<Range>('6M')

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const data = useMemo(() => {
    if (!transactions?.length) return []

    const map: Record<
      string,
      { month: string; income: number; expense: number; date: Date }
    > = {}

    for (const t of transactions) {
      // 🔥 FIX اصلی اینجاست
      const rawDate = (t as any).created_at
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

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center text-sm">
        Loading...
      </div>
    )
  }

  return (
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
  )
}
