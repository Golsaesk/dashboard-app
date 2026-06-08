import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'
import {
  getFixedCosts,
  addFixedCost,
  removeFixedCost,
  type FixedCost,
} from '../api/fixedCostsApi'

export const FIXED_COSTS_KEY = ['fixed-costs'] as const

type MutationContext = {
  previous: FixedCost[] | undefined
}

export function useFixedCosts() {
  return useQuery({
    queryKey: FIXED_COSTS_KEY,
    queryFn: getFixedCosts,
  })
}

export function useAddFixedCost(): UseMutationResult<
  FixedCost,
  Error,
  Omit<FixedCost, 'id'>,
  MutationContext
> {
  const qc = useQueryClient()

  return useMutation<FixedCost, Error, Omit<FixedCost, 'id'>, MutationContext>({
    mutationFn: addFixedCost,

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: FIXED_COSTS_KEY })
      const previous = qc.getQueryData<FixedCost[]>(FIXED_COSTS_KEY)

      const optimistic: FixedCost = {
        ...payload,
        id: `optimistic-${crypto.randomUUID()}`,
      }
      qc.setQueryData<FixedCost[]>(FIXED_COSTS_KEY, (old = []) => [
        optimistic,
        ...old,
      ])

      return { previous }
    },

    onSuccess: (real) => {
      qc.setQueryData<FixedCost[]>(FIXED_COSTS_KEY, (old = []) =>
        old.map((c) => (c.id.startsWith('optimistic-') ? real : c)),
      )
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        qc.setQueryData(FIXED_COSTS_KEY, ctx.previous)
      }
    },
  })
}

export function useRemoveFixedCost(): UseMutationResult<
  void,
  Error,
  string,
  MutationContext
> {
  const qc = useQueryClient()

  return useMutation<void, Error, string, MutationContext>({
    mutationFn: removeFixedCost,

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: FIXED_COSTS_KEY })
      const previous = qc.getQueryData<FixedCost[]>(FIXED_COSTS_KEY)
      qc.setQueryData<FixedCost[]>(FIXED_COSTS_KEY, (old = []) =>
        old.filter((c) => c.id !== id),
      )
      return { previous }
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous !== undefined) {
        qc.setQueryData(FIXED_COSTS_KEY, ctx.previous)
      }
    },
  })
}
