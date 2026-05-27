'use client'

import { useEffect } from 'react'
import { useFinanceStore } from '@/store/financeStore'

export default function FixedCostsList() {
  const fixedCosts = useFinanceStore((state) => state.fixedCosts),
    fetchFixedCosts = useFinanceStore((state) => state.fetchFixedCosts),
    removeFixedCost = useFinanceStore((state) => state.removeFixedCost)

  useEffect(() => {
    fetchFixedCosts()
  }, [])

  return (
    <div className="rounded-2xl bg-zinc-900 p-6">
      <h2 className="mb-6 text-xl font-bold text-white">Fixed Costs</h2>

      <div className="space-y-4">
        {fixedCosts.map((cost) => (
          <div
            key={cost.id}
            className="flex items-center justify-between rounded-xl bg-zinc-800 p-4"
          >
            <div>
              <h3 className="font-semibold text-white">{cost.title}</h3>

              <p className="text-sm text-zinc-400">Due Day: {cost.due_day}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-bold text-red-400">${cost.amount}</span>

              <button
                onClick={() => removeFixedCost(cost.id)}
                className="text-sm text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
