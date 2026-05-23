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
import { useFinanceStore } from '@/store/financeStore'

type Range = '6M' | '1Y' | 'ALL'

export default function SpendingTrendChart() {
  const transactions = useFinanceStore((state) => state.transactions),
    [range, setRange] = useState<Range>('6M'),
    data = useMemo(() => {
      const map: Record<
        string,
        { month: string; income: number; expense: number; date: Date }
      > = {}
      for (const t of transactions) {
        if (!t?.date) continue
        const date = new Date(t.date)
        if (isNaN(date.getTime())) continue
        const month = date.toLocaleString('en-US', { month: 'short' })
        if (!map[month]) {
          map[month] = {
            month,
            income: 0,
            expense: 0,
            date,
          }
        }
        const amount = t.amount ?? 0
        if (t.type === 'income') {
          map[month].income += amount
        } else {
          map[month].expense += amount
        }
      }

      let result = Object.values(map)
      result.sort((a, b) => a.date.getTime() - b.date.getTime())
      if (range === '6M') {
        result = result.slice(-6)
      }
      if (range === '1Y') {
        result = result.slice(-12)
      }

      return result
    }, [transactions, range])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Spending Trend</h2>
          <p className="text-sm text-zinc-500">Income vs expenses over time</p>
        </div>
        <div className="flex rounded-2xl border border-zinc-200 bg-zinc-50 p-1">
          {(['6M', '1Y', 'ALL'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-xl px-4 py-2 text-sm transition ${
                range === r
                  ? 'bg-[#0AA165] text-white shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#0AA165]" />
          <span className="text-zinc-600">Income</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <span className="text-zinc-600">Expenses</span>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0AA165" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0AA165" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>

            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#0AA165"
              fill="url(#income)"
              strokeWidth={2}
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#f87171"
              fill="url(#expense)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
