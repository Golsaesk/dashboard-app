'use client'

import { Transaction } from '@/type/transaction'
import { useFinanceStore } from '@/store/financeStore'

export default function MonthlyOutcomeCard() {
  const total = useFinanceStore((state: any) =>
    (state.transactions ?? [])
      .filter((t: Transaction) => t.type === 'outcome')
      .reduce((acc: number, item: Transaction) => {
        return acc + Number(item.amount || 0)
      }, 0),
  )

  return (
    <div className="rounded-xl border p-4">
      <p className="text-sm text-zinc-500">Monthly Outcome</p>

      <p className="text-xl font-semibold text-red-500">
        ${total.toLocaleString()}
      </p>
    </div>
  )
}
