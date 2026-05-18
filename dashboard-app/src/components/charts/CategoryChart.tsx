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
  const total = data.reduce((acc, item) => acc + item.value, 0)

  return (
    <div className="w-full max-w-[700px] rounded-2xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">{title}</h2>

        <button className="rounded-xl border px-4 py-2 text-sm text-gray-700">
          {period}
        </button>
      </div>

      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        {/* Chart */}
        <div className="relative h-[250px] w-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h3 className="text-3xl font-bold">${total.toLocaleString()}</h3>

            <p className="text-gray-500">{totalLabel}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-5">
          {data.map((item) => {
            const percent = ((item.value / total) * 100).toFixed(0)

            return (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />

                  <span className="text-gray-700">{item.name}</span>
                </div>

                <div className="flex items-center gap-8">
                  <span className="w-10 text-right text-gray-500">
                    {percent}%
                  </span>

                  <span className="w-20 text-right font-medium">
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
