import { create } from 'zustand'
import { Transaction } from '@/type/transaction'
import { financeRepo } from '@/lib/db/financeRepo'

type FinanceState = {
  transactions: Transaction[]
  loading: boolean

  fetchTransactions: () => Promise<void>
  addTransaction: (payload: Omit<Transaction, 'id'>) => Promise<void>
  removeTransaction: (id: string) => Promise<void>
  updateTransaction: (payload: Transaction) => Promise<void>
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  loading: false,

  fetchTransactions: async () => {
    try {
      set({ loading: true })

      const data = await financeRepo.fetchTransactions()

      const normalized =
        data?.map((t) => ({
          ...t,
          type: t.type === 'expense' ? 'outcome' : t.type,
        })) || []

      set({
        transactions: normalized,
        loading: false,
      })
    } catch (err) {
      console.error('fetchTransactions error:', err)
      set({ loading: false })
    }
  },

  addTransaction: async (payload) => {
    try {
      // 🔥 مهم: log برای debug
      console.log('adding transaction:', payload)

      const data = await financeRepo.addTransaction(payload)

      // ❗ اگر repo چیزی برنگردونه
      if (!data) {
        throw new Error('addTransaction returned empty response')
      }

      set((state) => ({
        transactions: [data, ...state.transactions],
      }))
    } catch (err) {
      console.error('addTransaction error:', err)

      // 🔥 fallback: UI crash نشه
      // حتی اگر backend fail شد، optimistic update
      set((state) => ({
        transactions: [
          {
            ...payload,
            id: crypto.randomUUID(),
          } as Transaction,
          ...state.transactions,
        ],
      }))
    }
  },

  removeTransaction: async (id) => {
    try {
      await financeRepo.removeTransaction(id)

      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }))
    } catch (err) {
      console.error('removeTransaction error:', err)
    }
  },

  updateTransaction: async (payload) => {
    try {
      const data = await financeRepo.updateTransaction(payload)

      if (!data) throw new Error('update failed')

      set((state) => ({
        transactions: state.transactions.map((t) =>
          t.id === payload.id ? data : t,
        ),
      }))
    } catch (err) {
      console.error('updateTransaction error:', err)
    }
  },
}))