import { supabase } from '@/lib/supabase/client'

const DEMO_STORAGE_KEY = 'demo_transactions'
const DEMO_FIXED_COSTS_KEY = 'demo_fixed_costs'

function getDemoTransactions() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}
function saveDemoTransactions(data: any[]) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data))
}
function getDemoFixedCosts() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_FIXED_COSTS_KEY) || '[]')
  } catch {
    return []
  }
}
function saveDemoFixedCosts(data: any[]) {
  localStorage.setItem(DEMO_FIXED_COSTS_KEY, JSON.stringify(data))
}

type RepoUser = { id: string; isDemo: boolean }

export const financeRepo = {
  async fetchTransactions(user: RepoUser) {
    if (user.isDemo) return getDemoTransactions()

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return data || []
  },

  async addTransaction(payload: any, user: RepoUser) {
    if (user.isDemo) {
      const newItem = { ...payload, id: crypto.randomUUID() }
      saveDemoTransactions([newItem, ...getDemoTransactions()])
      return newItem
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeTransaction(id: string, user: RepoUser) {
    if (user.isDemo) {
      saveDemoTransactions(
        getDemoTransactions().filter((t: any) => t.id !== id),
      )
      return true
    }

    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
    return true
  },

  async updateTransaction(payload: any, user: RepoUser) {
    if (user.isDemo) {
      saveDemoTransactions(
        getDemoTransactions().map((t: any) =>
          t.id === payload.id ? { ...t, ...payload } : t,
        ),
      )
      return payload
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({ amount: payload.amount, type: payload.type })
      .eq('id', payload.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async fetchFixedCosts(user: RepoUser) {
    if (user.isDemo) return getDemoFixedCosts()

    const { data } = await supabase
      .from('fixed_costs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return data || []
  },

  async addFixedCost(payload: any, user: RepoUser) {
    if (user.isDemo) {
      const newItem = { ...payload, id: crypto.randomUUID() }
      saveDemoFixedCosts([newItem, ...getDemoFixedCosts()])
      return newItem
    }

    const { data, error } = await supabase
      .from('fixed_costs')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeFixedCost(id: string, user: RepoUser) {
    if (user.isDemo) {
      saveDemoFixedCosts(getDemoFixedCosts().filter((c: any) => c.id !== id))
      return true
    }

    const { error } = await supabase.from('fixed_costs').delete().eq('id', id)
    if (error) throw error
    return true
  },
}
