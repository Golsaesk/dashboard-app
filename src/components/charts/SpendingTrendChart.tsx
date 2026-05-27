'use client'

import { useMemo, useState } from 'react'
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
        if (!map[month]) map[month] = { month, income: 0, expense: 0, date }
        const amount = t.amount ?? 0
        if (t.type === 'income') {
          map[month].income += amount
        } else {
          map[month].expense += amount
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
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
            Spending Trend
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Income vs expenses over time
          </p>
        </div>

        <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
          {(['6M', '1Y', 'ALL'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                range === r
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-5 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="text-zinc-600 dark:text-zinc-400">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="text-zinc-600 dark:text-zinc-400">Expenses</span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-zinc-400"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'currentColor' }}
              className="text-zinc-400"
              tickFormatter={(v) =>
                new Intl.NumberFormat('en-US', {
                  notation: 'compact',
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(v)
              }
            />
            <Tooltip
              contentStyle={{
                background: 'var(--tw-bg, white)',
                border: '1px solid #e4e4e7',
                borderRadius: '12px',
                fontSize: '13px',
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
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
