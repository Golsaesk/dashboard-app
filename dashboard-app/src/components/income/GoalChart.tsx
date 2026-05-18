'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Props = {
  value: number // مثلا 83
}

export default function GoalChart({ value }: Props) {
  const data = [
    { name: 'progress', value },
    { name: 'rest', value: 100 - value },
  ]

  const COLORS = ['#0AA165', '#E5E7EB']

  return (
    <div className="flex items-center justify-between gap-8 p-6">
      {/* بخش چارت */}
      <div className="flex flex-col items-start">
        <span className="mb-2 text-sm text-zinc-500">
          How close are you to your goal?
        </span>

        <div className="relative h-64 w-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={90}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* وسط دایره */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-zinc-900">{value}%</p>
            <p className="text-sm text-zinc-500">Completed</p>
          </div>
        </div>
      </div>

      {/* بخش اطلاعات */}
      <div className="flex flex-col items-start gap-3 text-left text-zinc-700">
        <div>
          <p className="text-sm text-zinc-500">Monthly Goal</p>
          <p className="text-2xl font-semibold text-zinc-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(5000)}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">You've Earned</p>
          <p className="text-xl font-medium text-zinc-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(1000)}
          </p>
        </div>

        <p className="text-sm font-medium text-green-600">Keep Going 🚀</p>
      </div>
    </div>
  )
}
