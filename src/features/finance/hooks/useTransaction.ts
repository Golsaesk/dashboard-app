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

type MutationContext = {
  previous: Transaction[] | undefined
}

export function useTransactions() {
  return useQuery({
    queryKey: TRANSACTIONS_KEY,
    queryFn: getTransactions,
  })
}

export function useAddTransaction(): UseMutationResult<
  Transaction,
  Error,
  Omit<Transaction, 'id'>,
  MutationContext
> {
  const qc = useQueryClient()

  return useMutation<
    Transaction,
    Error,
    Omit<Transaction, 'id'>,
    MutationContext
  >({
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

    onSuccess: (real) => {
      // replace the optimistic entry with the real one returned from server
      qc.setQueryData<Transaction[]>(TRANSACTIONS_KEY, (old = []) =>
        old.map((t) => (t.id.startsWith('optimistic-') ? real : t)),
      )
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        qc.setQueryData(TRANSACTIONS_KEY, ctx.previous)
      }
    },
  })
}

export function useRemoveTransaction(): UseMutationResult<
  void,
  Error,
  string,
  MutationContext
> {
  const qc = useQueryClient()

  return useMutation<void, Error, string, MutationContext>({
    mutationFn: removeTransaction,

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: TRANSACTIONS_KEY })
      const previous = qc.getQueryData<Transaction[]>(TRANSACTIONS_KEY)
      qc.setQueryData<Transaction[]>(TRANSACTIONS_KEY, (old = []) =>
        old.filter((t) => t.id !== id),
      )
      return { previous }
    },

    onError: (_err, _id, ctx) => {
      if (ctx?.previous !== undefined) {
        qc.setQueryData(TRANSACTIONS_KEY, ctx.previous)
      }
    },
  })
}

export function useUpdateTransaction(): UseMutationResult<
  Transaction,
  Error,
  Transaction,
  MutationContext
> {
  const qc = useQueryClient()

  return useMutation<Transaction, Error, Transaction, MutationContext>({
    mutationFn: updateTransaction,

    onMutate: async (payload) => {
      await qc.cancelQueries({ queryKey: TRANSACTIONS_KEY })
      const previous = qc.getQueryData<Transaction[]>(TRANSACTIONS_KEY)
      qc.setQueryData<Transaction[]>(TRANSACTIONS_KEY, (old = []) =>
        old.map((t) => (t.id === payload.id ? payload : t)),
      )
      return { previous }
    },

    onError: (_err, _payload, ctx) => {
      if (ctx?.previous !== undefined) {
        qc.setQueryData(TRANSACTIONS_KEY, ctx.previous)
      }
    },

    onSuccess: (real) => {
      qc.setQueryData<Transaction[]>(TRANSACTIONS_KEY, (old = []) =>
        old.map((t) => (t.id === real.id ? real : t)),
      )
    },
  })
}
