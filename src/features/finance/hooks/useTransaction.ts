import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query'
import {
  getTransactions,
  addTransaction,
  removeTransaction,
  updateTransaction,
} from '../api/transactionsApi'
import { Transaction } from '@/type/transaction'

export const TRANSACTIONS_KEY = ['transactions'] as const

export function useTransactions() {
  return useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: getTransactions,
  })
}

export function useAddTransaction(): UseMutationResult<
  Transaction,
  Error,
  Omit<Transaction, 'id'>
> {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: addTransaction,
    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: TRANSACTIONS_KEY })
      const previous = qc.getQueryData<Transaction[]>(TRANSACTIONS_KEY)

      const optimistic: Transaction = {
        ...payload,
        id: `optimistic-${crypto.randomUUID()}`,
      }
      qc.setQueryData<Transaction[]>(TRANSACTIONS_KEY, (old = []) => [
        optimistic,
        ...old,
      ])

      return { previous }
    },
    onSuccess: (real, _vars, ctx: any) => {
      qc.setQueryData<Transaction[]>(TRANSACTIONS_KEY, (old = []) =>
        old.map((t) => (t.id.startsWith('optimistic-') ? real : t)),
      )
    },
    onError: (_err, _vars, ctx: any) => {
      if (ctx?.previous) {
        qc.setQueryData(TRANSACTIONS_KEY, ctx.previous)
      }
    },
  })
}

export function useRemoveTransaction(): UseMutationResult<void, Error, string> {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: removeTransaction,

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: TRANSACTIONS_KEY })
      const previous = qc.getQueryData<Transaction[]>(TRANSACTIONS_KEY)
      qc.setQueryData<Transaction[]>(TRANSACTIONS_KEY, (old = []) =>
        old.filter((t) => t.id !== id),
      )
      return { previous }
    },

    onError: (_err, _id, ctx: any) => {
      if (ctx?.previous) qc.setQueryData(TRANSACTIONS_KEY, ctx.previous)
    },
  })
}

export function useUpdateTransaction(): UseMutationResult<
  Transaction,
  Error,
  Transaction
> {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: updateTransaction,

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: TRANSACTIONS_KEY })
      const previous = qc.getQueryData<Transaction[]>(TRANSACTIONS_KEY)
      qc.setQueryData<Transaction[]>(TRANSACTIONS_KEY, (old = []) =>
        old.map((t) => (t.id === payload.id ? payload : t)),
      )
      return { previous }
    },

    onError: (_err, _payload, ctx: any) => {
      if (ctx?.previous) qc.setQueryData(TRANSACTIONS_KEY, ctx.previous)
    },

    onSuccess: (real) => {
      qc.setQueryData<Transaction[]>(TRANSACTIONS_KEY, (old = []) =>
        old.map((t) => (t.id === real.id ? real : t)),
      )
    },
  })
}
