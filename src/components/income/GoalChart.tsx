'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Goal = {
  title: string
  target_amount: number
}

type Props = {
  goal?: Goal
  saved?: number
}

export default function GoalChart({ goal, saved = 0 }: Props) {
  const hasGoal = !!goal

  const safeGoal: Goal = goal ?? {
    title: 'No goal selected',
    target_amount: 1,
  }

  const percent = hasGoal
    ? Math.min(Math.round((saved / safeGoal.target_amount) * 100), 100)
    : 0

  const data = [{ value: percent }, { value: 100 - percent }]

  const COLORS = hasGoal ? ['#0AA165', '#E8F8F1'] : ['#E2E8F0', '#F1F5F9']

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-zinc-100 bg-white p-6 shadow-sm transition hover:shadow-md md:flex-row md:items-center md:justify-between">
      {/* CHART */}
      <div className="flex flex-col items-center">
        <p className="mb-2 text-sm text-zinc-500">{safeGoal.title}</p>

        <div className="relative h-56 w-56">
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
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center text-center">
            {hasGoal ? (
              <div>
                <p className="text-3xl font-bold text-zinc-900">{percent}%</p>
                <p className="text-sm text-zinc-500">Completed</p>
              </div>
            ) : (
              <p className="px-6 text-sm text-zinc-400">
                Goal has not been set
              </p>
            )}
          </div>
        </div>
      </div>

      {/* INFO */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-zinc-500">Goal</p>
          <p className="text-xl font-semibold text-zinc-900">
            {safeGoal.target_amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">Saved</p>
          <p className="text-lg font-medium text-zinc-900">
            {saved.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </p>
        </div>

        <p
          className={`text-sm font-medium ${hasGoal ? 'text-[#0AA165]' : 'text-zinc-400'}`}
        >
          {hasGoal ? 'Keep going 🚀' : 'Set your first goal'}
        </p>
      </div>
    </div>
  )
}
