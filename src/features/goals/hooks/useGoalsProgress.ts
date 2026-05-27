// features/goals/hooks/useGoalsProgress.ts
import { getGoals } from '../api/goalsApi'
import { useQuery } from '@tanstack/react-query'
import { calculateSavings } from '@/features/finance/utils/calcSavings'
import { getTransactions } from '@/features/finance/api/transactionsApi'

export function useGoalsProgress() {
  return useQuery({
    queryKey: ['goals-progress'],
    queryFn: async () => {
      const [goals, transactions] = await Promise.all([
        getGoals(),
        getTransactions(),
      ])

      const savings = calculateSavings(transactions)

      const progress = goals.map((goal) => ({
        ...goal,
        saved: goal.saved_amount ?? 0, // ← savedAmount → saved_amount
        percent: Math.min(
          ((goal.saved_amount ?? 0) / goal.target_amount) * 100,
          100,
        ),
      }))

      return progress
    },
  })
}
