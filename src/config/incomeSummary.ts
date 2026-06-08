import { Transaction } from '@/type/transaction'
import { ArrowDown, CircleDollarSign, TrendingUp, Wallet } from 'lucide-react'

import {
  getMonthlyAverage,
  getTopSource,
  getTotalIncome,
  getTotalOutcome,
} from '@/helper/finance'

export function getIncomeSummary(transactions: Transaction[]) {
  const incomeTransactions = transactions.filter((t) => t.type === 'income'),
    totalIncome = getTotalIncome(transactions),
    totalOutcome = getTotalOutcome(transactions),
    topSource = getTopSource(transactions),
    monthlyAverage = getMonthlyAverage(incomeTransactions)

  return [
    {
      name: 'Total Income',
      value: totalIncome,
      icon: Wallet,
    },
    {
      name: 'Top Source',
      value: topSource ?? 'No Source',
      icon: TrendingUp,
    },
    {
      name: 'Av. Month',
      value: monthlyAverage,
      icon: CircleDollarSign,
    },
    {
      name: 'Net After Expenses',
      value: totalIncome - totalOutcome,
      icon: ArrowDown,
    },
  ]
}
