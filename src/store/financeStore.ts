import { create } from 'zustand'
import { Goal } from '@/type/goal'
import { Transaction } from '@/type/transaction'
import { FixedCost } from '@/type/fixedCost'
import { supabase } from '@/lib/supabase/client'
import { isDemoUser } from '@/lib/isDemoUser'
import { createDemoId } from '@/lib/utils/createDemoId'

type FinanceStore = {
  transactions: Transaction[]
  goals: Goal[]
  fixedCosts: FixedCost[]
  loading: boolean

  fetchTransactions: () => Promise<void>
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
  removeTransaction: (id: string) => Promise<void>
  updateTransaction: (transaction: Transaction) => Promise<void>

  addGoal: (goal: Goal) => void
  removeGoal: (id: string) => void
  updateGoal: (goal: Goal) => void

  fetchFixedCosts: () => Promise<void>
  addFixedCost: (cost: Omit<FixedCost, 'id'>) => Promise<void>
  removeFixedCost: (id: string) => Promise<void>
  updateFixedCost: (cost: FixedCost) => Promise<void>

  totalMonthlyFixedCosts: () => number
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  transactions: [],
  goals: [],
  fixedCosts: [],
  loading: false,

  fetchTransactions: async () => {
    set({ loading: true })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      set({ loading: false })
      return
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
    }

    set({
      transactions: data || [],
      loading: false,
    })
  },

  addTransaction: async (transaction) => {
    const demo = await isDemoUser()

    if (demo) {
      set((state) => ({
        transactions: [
          {
            ...transaction,
            id: createDemoId(),
          } as Transaction,
          ...state.transactions,
        ],
      }))
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const payload = {
      amount: (transaction as any).amount,
      type: (transaction as any).type,
      user_id: user.id,
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('INSERT ERROR:', error)
      return
    }

    set((state) => ({
      transactions: [data, ...state.transactions],
    }))
  },

  removeTransaction: async (id) => {
    const demo = await isDemoUser()

    if (demo) {
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }))
      return
    }

    const { error } = await supabase.from('transactions').delete().eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    }))
  },

  updateTransaction: async (updatedTransaction) => {
    const { error } = await supabase
      .from('transactions')
      .update({
        amount: (updatedTransaction as any).amount,
        type: (updatedTransaction as any).type,
      })
      .eq('id', updatedTransaction.id)

    if (error) {
      console.error(error)
      return
    }

    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === updatedTransaction.id ? updatedTransaction : t,
      ),
    }))
  },

  addGoal: (goal) => set((state) => ({ goals: [goal, ...state.goals] })),

  removeGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),

  updateGoal: (updatedGoal) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === updatedGoal.id ? updatedGoal : g,
      ),
    })),

  fetchFixedCosts: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('fixed_costs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    set({ fixedCosts: data || [] })
  },

  addFixedCost: async (cost) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('fixed_costs')
      .insert({
        ...cost,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      return
    }

    set((state) => ({
      fixedCosts: [data, ...state.fixedCosts],
    }))
  },

  removeFixedCost: async (id) => {
    const { error } = await supabase.from('fixed_costs').delete().eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    set((state) => ({
      fixedCosts: state.fixedCosts.filter((c) => c.id !== id),
    }))
  },

  updateFixedCost: async (updatedCost) => {
    const { error } = await supabase
      .from('fixed_costs')
      .update(updatedCost)
      .eq('id', updatedCost.id)

    if (error) {
      console.error(error)
      return
    }

    set((state) => ({
      fixedCosts: state.fixedCosts.map((c) =>
        c.id === updatedCost.id ? updatedCost : c,
      ),
    }))
  },

  totalMonthlyFixedCosts: () =>
    get().fixedCosts.reduce((acc, item) => acc + Number(item.amount), 0),
}))
