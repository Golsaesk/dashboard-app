import { Transaction } from '@/type/transaction'
import { ArrowDown, CircleDollarSign, TrendingUp, Wallet } from 'lucide-react'
import {
  getMonthlyAverage,
  getTopSource,
  getTotalIncome,
  getTotalOutcome,
} from '@/helper/finance'

export function getIncomeSummary(transactions: Transaction[]) {
  const incomeTransactions = transactions.filter((t) => t.type === 'income')
  return [
    {
      name: 'Total Income',
      total: getTotalIncome(transactions),
      icon: Wallet,
    },

    {
      name: 'Top Source',
      value: getTopSource(transactions),
      icon: TrendingUp,
    },

    {
      name: 'Av. Month',
      total: getMonthlyAverage(incomeTransactions),
      icon: CircleDollarSign,
    },

    {
      name: 'Net After Outcome',
      total: getTotalIncome(transactions) - getTotalOutcome(transactions),
      icon: ArrowDown,
    },
  ]
}
