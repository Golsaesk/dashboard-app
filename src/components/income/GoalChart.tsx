'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Props = {
  goal: {
    title: string
    target_amount: number
  }
  saved: number
}

export default function GoalChart({ goal, saved }: Props) {
  const percent = Math.min(Math.round((saved / goal.target_amount) * 100), 100)

  const data = [
    { name: 'progress', value: percent },
    { name: 'rest', value: 100 - percent },
  ]

  const COLORS = ['#0AA165', '#E5E7EB']

  return (
    <div className="flex items-center justify-between gap-8 p-6">
      {/* CHART */}
      <div className="flex flex-col items-start">
        <span className="mb-2 text-sm text-zinc-500">{goal.title}</span>

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

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-zinc-900">{percent}%</p>
            <p className="text-sm text-zinc-500">Completed</p>
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="flex flex-col items-start gap-3 text-left text-zinc-700">
        <div>
          <p className="text-sm text-zinc-500">Goal</p>
          <p className="text-2xl font-semibold text-zinc-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(goal.target_amount)}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">Saved</p>
          <p className="text-xl font-medium text-zinc-900">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(saved)}
          </p>
        </div>

        <p className="text-sm font-medium text-green-600">Keep Going 🚀</p>
      </div>
    </div>
  )
}
