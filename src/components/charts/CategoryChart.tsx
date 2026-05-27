'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
type CategoryItem = {
  name: string
  value: number
  color: string
}

type Props = {
  title?: string
  totalLabel?: string
  period?: string
  data: CategoryItem[]
}

export default function CategoryAnalysisCard({
  title = 'Category Analysis',
  totalLabel = 'Total',
  period = 'This Month',
  data,
}: Props) {
  const total = data.reduce((a, b) => a + b.value, 0)

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
          {title}
        </h2>
        <button className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200">
          {period}
        </button>
      </div>
      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        <div className="relative mx-auto h-52 w-52 shrink-0 md:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                strokeWidth={0}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-semibold text-zinc-900 dark:text-white">
              ${total.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {totalLabel}
            </p>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item) => {
            const percent = ((item.value / total) * 100).toFixed(0)
            return (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl px-3 py-2 transition hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">
                    {item.name}
                  </span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-zinc-400 dark:text-zinc-500">
                    {percent}%
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white">
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
