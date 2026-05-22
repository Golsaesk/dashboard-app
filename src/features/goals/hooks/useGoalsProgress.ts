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
        ]),
        savings = calculateSavings(transactions),
        progress = goals.map((goal) => ({
          ...goal,

          saved: savings,

          percent: Math.min((savings / goal.target_amount) * 100, 100),
        }))

      return progress
    },
  })
}
