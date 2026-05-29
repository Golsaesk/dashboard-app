// GoalChart.tsx
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Target } from 'lucide-react'

type Goal = {
  title: string
  target_amount: number
  saved_amount: number
}

export default function GoalChart({ goal }: { goal?: Goal }) {
  if (!goal) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-center text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
        No goal set
      </div>
    )
  }

  const percent = Math.min(
    Math.round((goal.saved_amount / goal.target_amount) * 100),
    100,
  )

  const data = [{ value: percent }, { value: 100 - percent }]

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 lg:flex-row lg:items-center lg:justify-between dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
          <Target className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Saving Goal
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {goal.title}
          </h3>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-5 lg:mt-0">
        <div className="relative h-36 w-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={45}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill="#0AA165" />
                <Cell fill="#E5E7EB" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xl font-bold text-zinc-900 dark:text-white">
              {percent}%
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Target</p>

            <p className="font-semibold text-zinc-900 dark:text-white">
              $
              {goal.target_amount.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Saved</p>

            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              $
              {goal.saved_amount.toLocaleString('en-US', {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
