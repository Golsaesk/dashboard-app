'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  {
    month: 'Jan',
    income: 4200,
    expense: 2400,
  },
  {
    month: 'Feb',
    income: 5100,
    expense: 3200,
  },
  {
    month: 'Mar',
    income: 4800,
    expense: 2800,
  },
  {
    month: 'Apr',
    income: 6200,
    expense: 4100,
  },
  {
    month: 'May',
    income: 5900,
    expense: 3600,
  },
  {
    month: 'Jun',
    income: 7100,
    expense: 4300,
  },
]

export default function SpendingTrendChart() {
  return (
    <div className="rounded-3xl p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900">Spending Trend</h2>

          <p className="mt-1 text-sm text-zinc-500">
            Income vs expenses over time
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-1">
          <button className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm">
            6M
          </button>

          <button className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900">
            1Y
          </button>

          <button className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900">
            All
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#0AA165]" />

          <p className="text-sm text-zinc-600">Income</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-400" />

          <p className="text-sm text-zinc-600">Expenses</p>
        </div>
      </div>

      {/* Chart */}
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

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#71717a',
                fontSize: 12,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#71717a',
                fontSize: 12,
              }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#0AA165"
              fill="url(#income)"
              strokeWidth={3}
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#f87171"
              fill="url(#expense)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
