'use client'

import { formatCurrency } from '@/lib/utils/currency'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Goal = {
  title: string
  target_amount: number
  saved_amount: number
}

export default function GoalChart({ goal }: { goal?: Goal }) {
  if (!goal) {
    return (
      <div className="py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
        No goal set
      </div>
    )
  }

  const safeTarget = Math.max(goal.target_amount || 0, 1)
  const percent = Math.min(
    Math.round((goal.saved_amount / safeTarget) * 100),
    100,
  )
  const remaining = Math.max(safeTarget - goal.saved_amount, 0)
  const isCompleted = percent >= 100
  const data = [{ value: percent }, { value: 100 - percent }]

  return (
    <div className="flex w-full items-center justify-between gap-6">
      {/* Chart — سمت چپ */}
      <div className="relative h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={45}
              outerRadius={62}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill="#10b981" />
              <Cell
                fill="currentColor"
                className="text-zinc-100 dark:text-zinc-800"
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            {percent}%
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center gap-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
            {goal.title}
          </h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {isCompleted ? 'Completed 🎉' : 'In progress'}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Progress</p>
          <p className="mt-0.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {percent}%
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Saved</p>
          <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-white">
            {formatCurrency(goal.saved_amount)}
          </p>
        </div>
      </div>
    </div>
  )
}
