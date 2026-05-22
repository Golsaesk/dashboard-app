import { Transaction } from '@/type/transaction'
import { BarChart3, Wallet } from 'lucide-react'
import { getTotalIncome, getTotalOutcome } from '@/helper/finance'

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
  ]
}
