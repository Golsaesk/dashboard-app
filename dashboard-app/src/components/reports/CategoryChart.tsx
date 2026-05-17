'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
  {
    name: 'Housing',
    value: 35,
    color: '#0AA165',
  },
  {
    name: 'Food',
    value: 25,
    color: '#2dbb84',
  },
  {
    name: 'Transport',
    value: 20,
    color: '#7dd3a8',
  },
  {
    name: 'Entertainment',
    value: 20,
    color: '#c7f5df',
  },
]

export default function CategoryChart() {
  return (
    <div className="rounded-3xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-zinc-900">Category Analysis</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Breakdown of your monthly expenses
        </p>
      </div>

      <div className="flex items-center justify-between gap-6">
        {/* Chart */}
        <div className="h-64 w-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: item.color,
                }}
              />

              <div>
                <p className="text-sm font-medium text-zinc-800">{item.name}</p>

                <p className="text-sm text-zinc-500">{item.value}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
