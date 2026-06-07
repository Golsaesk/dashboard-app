import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'
import { getGoals } from '../api/goalsApi'
import { createGoal } from '../api/createGoalsApi'
import { updateGoalSaved } from '../api/updateGoalApi'
import { deleteGoal } from '../api/deleteGoalApi'

export const GOALS_KEY = ['goals-progress'] as const

export type GoalProgress = {
  id: string
  title: string
  target_amount: number
  saved: number
  percent: number
}

function toGoalProgress(raw: {
  id: string
  title: string
  target_amount: number
  saved_amount: number
}): GoalProgress {
  const percent =
    raw.target_amount > 0
      ? Math.min(Math.round((raw.saved_amount / raw.target_amount) * 100), 100)
      : 0

  return {
    id: raw.id,
    title: raw.title,
    target_amount: raw.target_amount,
    saved: raw.saved_amount,
    percent,
  }
}
export function useGoalsProgress() {
  return useQuery({
    queryKey: GOALS_KEY,
    queryFn: async () => {
      const rows = await getGoals()
      return rows.map(toGoalProgress)
    },
  })
}

export function useCreateGoal(): UseMutationResult<
  void,
  Error,
  { title: string; target_amount: number; saved: number }
> {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: GOALS_KEY })
    },
  })
}

export function useUpdateGoalSaved(): UseMutationResult<
  void,
  Error,
  { id: string; saved: number }
> {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateGoalSaved,

    onMutate: async ({ id, saved }) => {
      await qc.cancelQueries({ queryKey: GOALS_KEY })
      const previous = qc.getQueryData<GoalProgress[]>(GOALS_KEY)

      qc.setQueryData<GoalProgress[]>(GOALS_KEY, (old = []) =>
        old.map((g) =>
          g.id === id
            ? {
                ...g,
                saved,
                percent: Math.min(
                  Math.round((saved / g.target_amount) * 100),
                  100,
                ),
              }
            : g,
        ),
      )

      return { previous }
    },

    onError: (_err, _vars, ctx: any) => {
      if (ctx?.previous) qc.setQueryData(GOALS_KEY, ctx.previous)
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: GOALS_KEY })
    },
  })
}

export function useDeleteGoal(): UseMutationResult<void, Error, string> {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteGoal,

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: GOALS_KEY })
      const previous = qc.getQueryData<GoalProgress[]>(GOALS_KEY)
      qc.setQueryData<GoalProgress[]>(GOALS_KEY, (old = []) =>
        old.filter((g) => g.id !== id),
      )
      return { previous }
    },

    onError: (_err, _id, ctx: any) => {
      if (ctx?.previous) qc.setQueryData(GOALS_KEY, ctx.previous)
    },
  })
}
