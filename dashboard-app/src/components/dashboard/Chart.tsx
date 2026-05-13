'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'

const allData = [
  { month: 'Jan', cost: 400, income: 800, balance: 400 },
  { month: 'Feb', cost: 300, income: 700, balance: 400 },
  { month: 'Mar', cost: 600, income: 900, balance: 300 },
  { month: 'Apr', cost: 200, income: 500, balance: 300 },
  { month: 'May', cost: 500, income: 1000, balance: 500 },
]

export default function FinanceChart() {
  const [metric, setMetric] = useState('cost')

  return (
    <div className="flex w-full items-center gap-4 bg-gray-100 p-6 text-gray-800">
      <div className="w-full">
        {/* 🎛️ فیلتر */}
        <div className="mb-4 flex justify-between">
          <button onClick={() => setMetric('cost')} className="px-3 py-1">
            Cost
          </button>
          <button onClick={() => setMetric('income')} className="px-3 py-1">
            Income
          </button>
          <button
            onClick={() => setMetric('balance')}
            className="rounded bg-green-500 px-3 py-1 text-white"
          >
            Balance
          </button>
        </div>

        {/* 📊 Chart */}
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={allData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey={metric}
                stroke="#3b82f6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
