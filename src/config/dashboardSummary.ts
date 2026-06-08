import { Transaction } from '@/type/transaction'
import { ArrowDown, ArrowUp, PiggyBank, Trophy } from 'lucide-react'
import {
  getNetSaving,
  getTopSource,
  getTotalIncome,
  getTotalOutcome,
} from '@/helper/finance'

export function getDashboardSummary(transactions: Transaction[]) {
  return [
    {
      name: 'Total Income',
      total: getTotalIncome(transactions),
      icon: ArrowUp,
    },

    {
      name: 'Total Outcome',
      total: getTotalOutcome(transactions),
      icon: ArrowDown,
    },

    {
      name: 'Net Saving',
      total: getNetSaving(transactions),
      icon: PiggyBank,
    },
    {
      name: 'Top Source',
      total: getTopSource(transactions),
      icon: Trophy,
    },
  ]
}
