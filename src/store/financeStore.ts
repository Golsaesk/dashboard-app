import { create } from 'zustand'
import { Transaction } from '@/type/transaction'
import { financeRepo } from '@/lib/db/financeRepo'

type FixedCost = {
  id: string
  title: string
  amount: number
  due_day: number
}

type FinanceState = {
  transactions: Transaction[]
  fixedCosts: FixedCost[]
  loading: boolean

  fetchTransactions: () => Promise<void>
  addTransaction: (payload: Omit<Transaction, 'id'>) => Promise<void>
  removeTransaction: (id: string) => Promise<void>
  updateTransaction: (payload: Transaction) => Promise<void>

  fetchFixedCosts: () => Promise<void>
  addFixedCost: (payload: Omit<FixedCost, 'id'>) => Promise<void>
  removeFixedCost: (id: string) => Promise<void>
}

export const useFinanceStore = create<FinanceState>((set) => ({
  transactions: [],
  fixedCosts: [],
  loading: false,

  fetchTransactions: async () => {
    try {
      set({ loading: true })
      const data = await financeRepo.fetchTransactions()
      const normalized =
        data?.map((t: any) => ({
          ...t,
          type: t.type === 'expense' ? 'outcome' : t.type,
        })) || []
      set({ transactions: normalized, loading: false })
    } catch (err) {
      console.error('fetchTransactions error:', err)
      set({ loading: false })
    }
  },

  addTransaction: async (payload) => {
    try {
      const data = await financeRepo.addTransaction(payload)
      if (!data) throw new Error('addTransaction returned empty response')
      set((state) => ({ transactions: [data, ...state.transactions] }))
    } catch (err) {
      console.error('addTransaction error:', err)
      set((state) => ({
        transactions: [
          { ...payload, id: crypto.randomUUID() } as Transaction,
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

  fetchFixedCosts: async () => {
    try {
      const data = await financeRepo.fetchFixedCosts()
      set({ fixedCosts: data || [] })
    } catch (err) {
      console.error('fetchFixedCosts error:', err)
    }
  },

  addFixedCost: async (payload) => {
    try {
      const data = await financeRepo.addFixedCost(payload)
      if (!data) throw new Error('addFixedCost failed')
      set((state) => ({ fixedCosts: [data, ...state.fixedCosts] }))
    } catch (err) {
      console.error('addFixedCost error:', err)
    }
  },

  removeFixedCost: async (id) => {
    try {
      await financeRepo.removeFixedCost(id)
      set((state) => ({
        fixedCosts: state.fixedCosts.filter((c) => c.id !== id),
      }))
    } catch (err) {
      console.error('removeFixedCost error:', err)
    }
  },
}))
