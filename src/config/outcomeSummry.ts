import { Transaction } from '@/type/transaction'
import { CreditCard, Receipt, TrendingDown, Wallet } from 'lucide-react'
import {
  getMonthlyAverage,
  getMostSpend,
  getTotalOutcome,
} from '@/helper/finance'
export function getOutcomeSummary(transactions: Transaction[]) {
  const outcomeTransactions = transactions.filter((t) => t.type === 'expense')
  return [
    {
      name: 'Total Expenses',
      total: getTotalOutcome(transactions),
      icon: CreditCard,
    },

    {
      name: 'Month Avg',
      total: getMonthlyAverage(outcomeTransactions),
      icon: Wallet,
    },

    {
      name: 'Most Spend',
      value: getMostSpend(transactions),
      icon: TrendingDown,
    },

    {
      name: 'Transactions',
      total: outcomeTransactions.length,
      icon: Receipt,
    },
  ]
}
