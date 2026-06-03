import { useEffect } from 'react'
import { useGoalStore } from './useGoalStore'

export function useGoalsProgress() {
  const goals = useGoalStore((state) => state.goals)
  const loading = useGoalStore((state) => state.loading)
  const fetchGoals = useGoalStore((state) => state.fetchGoals)

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const data = goals.map((goal) => ({
    id: goal.id,
    title: goal.title,
    target_amount: goal.target,
    saved: goal.saved,
    percent:
      goal.target > 0
        ? Math.min(Math.round((goal.saved / goal.target) * 100), 100)
        : 0,
  }))

  return {
    data,
    isLoading: loading,
  }
}
