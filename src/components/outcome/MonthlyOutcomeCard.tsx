'use client'

import { useFinanceStore } from '@/store/financeStore'

export default function MonthlyOutcomeCard() {
  const total = useFinanceStore((state) => state.totalMonthlyFixedCosts())

  return (
    <div className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 p-6">
      <p className="mb-2 text-white/70">Monthly Fixed Costs</p>
      <h1 className="text-4xl font-bold text-white">${total}</h1>
    </div>
  )
}
