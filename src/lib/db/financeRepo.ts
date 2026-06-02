import { supabase } from '@/lib/supabase/client'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

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

export const financeRepo = {
  async fetchTransactions() {
    const user = await getCurrentUser()
    if (!user) return []

    if (user.isDemo) return getDemoTransactions() // ✅ از localStorage بخون

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return data || []
  },

  async addTransaction(payload: any) {
    const user = await getCurrentUser()
    if (!user) return null

    if (user.isDemo) {
      const newItem = { ...payload, id: crypto.randomUUID() }
      const existing = getDemoTransactions()
      saveDemoTransactions([newItem, ...existing]) // ✅ توی localStorage ذخیره کن
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

  async removeTransaction(id: string) {
    const user = await getCurrentUser()
    if (!user) return true

    if (user.isDemo) {
      const updated = getDemoTransactions().filter((t: any) => t.id !== id)
      saveDemoTransactions(updated) // ✅
      return true
    }

    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) throw error
    return true
  },

  async updateTransaction(payload: any) {
    const user = await getCurrentUser()
    if (!user) return payload

    if (user.isDemo) {
      const updated = getDemoTransactions().map((t: any) =>
        t.id === payload.id ? { ...t, ...payload } : t,
      )
      saveDemoTransactions(updated) // ✅
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

  async fetchFixedCosts() {
    const user = await getCurrentUser()
    if (!user) return []

    if (user.isDemo) return getDemoFixedCosts() // ✅

    const { data } = await supabase
      .from('fixed_costs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    return data || []
  },

  async addFixedCost(payload: any) {
    const user = await getCurrentUser()
    if (!user) return null

    if (user.isDemo) {
      const newItem = { ...payload, id: crypto.randomUUID() }
      const existing = getDemoFixedCosts()
      saveDemoFixedCosts([newItem, ...existing]) // ✅
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

  async removeFixedCost(id: string) {
    const user = await getCurrentUser()
    if (!user) return true

    if (user.isDemo) {
      const updated = getDemoFixedCosts().filter((c: any) => c.id !== id)
      saveDemoFixedCosts(updated) // ✅
      return true
    }

    const { error } = await supabase.from('fixed_costs').delete().eq('id', id)
    if (error) throw error
    return true
  },

  async updateFixedCost(payload: any) {
    const user = await getCurrentUser()
    if (!user) return payload

    if (user.isDemo) {
      const updated = getDemoFixedCosts().map((c: any) =>
        c.id === payload.id ? { ...c, ...payload } : c,
      )
      saveDemoFixedCosts(updated) // ✅
      return payload
    }

    const { data, error } = await supabase
      .from('fixed_costs')
      .update(payload)
      .eq('id', payload.id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}
