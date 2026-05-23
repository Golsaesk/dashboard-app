'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

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
    <div className="w-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900">{title}</h2>
        <button className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900">
          {period}
        </button>
      </div>
      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        <div className="relative h-64 w-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-zinc-900">
              ${total.toLocaleString()}
            </p>
            <p className="text-sm text-zinc-500">{totalLabel}</p>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((item) => {
            const percent = ((item.value / total) * 100).toFixed(0)
            return (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-xl px-2 py-2 transition hover:bg-zinc-50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="text-sm text-zinc-700">{item.name}</span>
                </div>

                <div className="flex gap-6 text-sm">
                  <span className="text-zinc-500">{percent}%</span>
                  <span className="font-medium text-zinc-900">
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
