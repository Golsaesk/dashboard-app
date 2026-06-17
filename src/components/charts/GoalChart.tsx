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
      <div className="text-muted-foreground py-6 text-center text-sm">
        No goal set
      </div>
    )
  }

  const safeTarget = Math.max(goal.target_amount || 0, 1)
  const percent = Math.min(
    Math.round((goal.saved_amount / safeTarget) * 100),
    100,
  )
  const isCompleted = percent >= 100
  const data = [{ value: percent }, { value: 100 - percent }]

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-44 w-full max-w-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="68%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              dataKey="value"
              stroke="none"
              cy="85%"
            >
              <Cell fill="var(--primary)" />
              <Cell fill="var(--muted)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2 text-center">
          <p className="text-foreground text-3xl font-bold">{percent}%</p>
          <p className="text-muted-foreground text-xs">Progress Percentage</p>
        </div>
      </div>

      <div className="border-border flex w-full items-center justify-between gap-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <span className="bg-primary h-2.5 w-2.5 rounded-full" />
          <div>
            <p className="text-muted-foreground text-xs">Achieved</p>
            <p className="text-foreground text-sm font-semibold">
              {formatCurrency(goal.saved_amount)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-muted h-2.5 w-2.5 rounded-full" />
          <div>
            <p className="text-muted-foreground text-xs">Target</p>
            <p className="text-foreground text-sm font-semibold">
              {formatCurrency(goal.target_amount)}
            </p>
          </div>
        </div>
      </div>

      {isCompleted && (
        <p className="text-primary text-center text-xs font-medium">
          🎉 Goal completed!
        </p>
      )}
    </div>
  )
}
