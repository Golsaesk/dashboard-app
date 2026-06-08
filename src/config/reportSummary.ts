import { Transaction } from '@/type/transaction'
import { BarChart3, PiggyBank, TrendingUp, Wallet } from 'lucide-react'
import {
  getMonthlyAverage,
  getNetSaving,
  getTotalIncome,
  getTotalOutcome,
} from '@/helper/finance'

export function getReportSummary(transactions: Transaction[]) {
  return [
    {
      name: 'Total Spending',
      total: getTotalOutcome(transactions),
      icon: BarChart3,
    },

    {
      name: 'Total Income',
      total: getTotalIncome(transactions),
      icon: Wallet,
    },
    {
      name: 'Total Savings',
      total: getNetSaving(transactions),
      icon: PiggyBank,
    },
    {
      name: 'Monthly Average',
      total: getMonthlyAverage(transactions),
      icon: TrendingUp,
    },
  ]
}
