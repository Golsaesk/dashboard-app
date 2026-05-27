import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

type Goal = {
  title: string
  target_amount: number
  saved_amount: number
}

export default function GoalChart({ goal }: { goal?: Goal }) {
  if (!goal) {
    return <div className="text-center text-sm text-zinc-400">No goal set</div>
  }

  const percent = Math.min(
      Math.round((goal.saved_amount / goal.target_amount) * 100),
      100,
    ),
    data = [{ value: percent }, { value: 100 - percent }]

  return (
    <div className="flex gap-6">
      <div className="h-48 w-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
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
        <div className="relative -mt-32 text-center">
          <p className="text-xl font-bold">{percent}%</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="font-semibold">{goal.title}</p>
        <p className="text-sm text-zinc-500">Target: ${goal.target_amount}</p>
        <p className="text-sm text-zinc-500">Saved: ${goal.saved_amount}</p>
      </div>
    </div>
  )
}
