export function useGoalStore() {
  throw new Error(
    '[useGoalStore] Deprecated. Use useGoalsProgress from the same directory instead.',
  )
}

export type Goal = {
  id: string
  title: string
  target: number
  saved: number
}
