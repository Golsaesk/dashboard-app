import { create } from 'zustand'
import { Goal } from '@/type/goal'
import { Transaction } from '@/type/transaction'
import { FixedCost } from '@/type/fixedCost'
import { supabase } from '@/lib/supabase/client'
type FinanceStore = {
  transactions: Transaction[]
  goals: Goal[]
  fixedCosts: FixedCost[]

  loading: boolean

  // =========================
  // TRANSACTIONS
  // =========================

  fetchTransactions: () => Promise<void>

  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>

  removeTransaction: (id: string) => Promise<void>

  updateTransaction: (transaction: Transaction) => Promise<void>

  // =========================
  // GOALS
  // =========================

  addGoal: (goal: Goal) => void
  removeGoal: (id: string) => void
  updateGoal: (goal: Goal) => void

  // =========================
  // FIXED COSTS
  // =========================

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

  // ======================================
  // TRANSACTIONS
  // ======================================

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
      .order('date', {
        ascending: false,
      })

    if (error) {
      console.error(error)
    }

    set({
      transactions: data || [],
      loading: false,
    })
  },

  addTransaction: async (transaction) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...transaction,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error(error)
      return
    }

    set((state) => ({
      transactions: [data, ...state.transactions],
    }))
  },

  removeTransaction: async (id) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    set((state) => ({
      transactions: state.transactions.filter((item) => item.id !== id),
    }))
  },

  updateTransaction: async (updatedTransaction) => {
    const { error } = await supabase
      .from('transactions')
      .update(updatedTransaction)
      .eq('id', updatedTransaction.id)

    if (error) {
      console.error(error)
      return
    }

    set((state) => ({
      transactions: state.transactions.map((item) =>
        item.id === updatedTransaction.id ? updatedTransaction : item,
      ),
    }))
  },

  // ======================================
  // GOALS
  // ======================================

  addGoal: (goal) =>
    set((state) => ({
      goals: [goal, ...state.goals],
    })),

  removeGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
    })),

  updateGoal: (updatedGoal) =>
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === updatedGoal.id ? updatedGoal : goal,
      ),
    })),

  // ======================================
  // FIXED COSTS
  // ======================================

  fetchFixedCosts: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('fixed_costs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      console.error(error)
      return
    }

    set({
      fixedCosts: data || [],
    })
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
      fixedCosts: state.fixedCosts.filter((item) => item.id !== id),
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
      fixedCosts: state.fixedCosts.map((item) =>
        item.id === updatedCost.id ? updatedCost : item,
      ),
    }))
  },

  totalMonthlyFixedCosts: () => {
    return get().fixedCosts.reduce((acc, item) => acc + Number(item.amount), 0)
  },
}))
