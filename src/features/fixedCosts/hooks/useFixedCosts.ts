import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getFixedCosts,
  addFixedCost,
  removeFixedCost,
  type FixedCost,
} from '../api/fixedCostsApi'

export const FIXED_COSTS_KEY = ['fixed-costs'] as const

export function useFixedCosts() {
  return useQuery({ queryKey: FIXED_COSTS_KEY, queryFn: getFixedCosts })
}

export function useAddFixedCost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addFixedCost,
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: FIXED_COSTS_KEY })
      const previous = qc.getQueryData<FixedCost[]>(FIXED_COSTS_KEY)
      qc.setQueryData<FixedCost[]>(FIXED_COSTS_KEY, (old = []) => [
        { ...payload, id: `optimistic-${crypto.randomUUID()}` },
        ...old,
      ])
      return { previous }
    },
    onSuccess: (real) => {
      qc.setQueryData<FixedCost[]>(FIXED_COSTS_KEY, (old = []) =>
        old.map((c) => (c.id.startsWith('optimistic-') ? real : c)),
      )
    },
    onError: (_e, _v, ctx: any) => {
      if (ctx?.previous) qc.setQueryData(FIXED_COSTS_KEY, ctx.previous)
    },
  })
}

export function useRemoveFixedCost() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removeFixedCost,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: FIXED_COSTS_KEY })
      const previous = qc.getQueryData<FixedCost[]>(FIXED_COSTS_KEY)
      qc.setQueryData<FixedCost[]>(FIXED_COSTS_KEY, (old = []) =>
        old.filter((c) => c.id !== id),
      )
      return { previous }
    },
    onError: (_e, _v, ctx: any) => {
      if (ctx?.previous) qc.setQueryData(FIXED_COSTS_KEY, ctx.previous)
    },
  })
}
