'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Transaction } from '@/type/transaction'
import { financeRepo } from '@/lib/db/financeRepo'
import { useAuthStore } from '@/store/authStore'

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

// helper که user رو از authStore میگیره
function getRepoUser() {
  const user = useAuthStore.getState().user
  if (!user) return null
  return {
    id: user.is_anonymous ? 'demo-user' : user.id,
    isDemo: user.is_anonymous === true,
  }
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: [],
      fixedCosts: [],
      loading: false,

      fetchTransactions: async () => {
        const user = getRepoUser()
        if (!user) return

        try {
          set({ loading: true })
          const data = await financeRepo.fetchTransactions(user)
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
        const user = getRepoUser()
        if (!user) return

        try {
          const data = await financeRepo.addTransaction(payload, user)
          if (!data) throw new Error('empty response')
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
        const user = getRepoUser()
        if (!user) return

        try {
          await financeRepo.removeTransaction(id, user)
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
          }))
        } catch (err) {
          console.error('removeTransaction error:', err)
        }
      },

      updateTransaction: async (payload) => {
        const user = getRepoUser()
        if (!user) return

        try {
          const data = await financeRepo.updateTransaction(payload, user)
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
        const user = getRepoUser()
        if (!user) return

        try {
          const data = await financeRepo.fetchFixedCosts(user)
          set({ fixedCosts: data || [] })
        } catch (err) {
          console.error('fetchFixedCosts error:', err)
        }
      },

      addFixedCost: async (payload) => {
        const user = getRepoUser()
        if (!user) return

        try {
          const data = await financeRepo.addFixedCost(payload, user)
          if (!data) throw new Error('addFixedCost failed')
          set((state) => ({ fixedCosts: [data, ...state.fixedCosts] }))
        } catch (err) {
          console.error('addFixedCost error:', err)
        }
      },

      removeFixedCost: async (id) => {
        const user = getRepoUser()
        if (!user) return

        try {
          await financeRepo.removeFixedCost(id, user)
          set((state) => ({
            fixedCosts: state.fixedCosts.filter((c) => c.id !== id),
          }))
        } catch (err) {
          console.error('removeFixedCost error:', err)
        }
      },
    }),
    {
      name: 'finance-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        fixedCosts: state.fixedCosts,
      }),
    },
  ),
)
