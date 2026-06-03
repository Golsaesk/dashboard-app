import { getGoals } from '../api/goalsApi'
import { Transaction } from '@/type/transaction'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTransactions } from '@/features/finance/hooks/useTransaction'

export const GOALS_KEY = ['goals'] as const

export function useGoalsProgress() {
  const { data: transactions = [] } = useTransactions()

  return useQuery({
    queryKey: GOALS_KEY,
    queryFn: getGoals,
    select: (goals) => {
      const totalIncome = transactions
        .filter((t: Transaction) => t.type === 'income')
        .reduce((s: number, t: Transaction) => s + t.amount, 0)

      return goals.map((goal) => ({
        ...goal,
        saved: goal.saved_amount ?? 0,
        percent: Math.min(
          ((goal.saved_amount ?? 0) / goal.target_amount) * 100,
          100,
        ),
        totalIncome,
      }))
    },
  })
}
