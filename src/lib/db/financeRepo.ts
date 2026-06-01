import { supabase } from '@/lib/supabase/client'
import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export const financeRepo = {
  async fetchTransactions() {
    const user = await getCurrentUser()
    if (!user || user.isDemo) return []

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
      return {
        ...payload,
        id: crypto.randomUUID(),
      }
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...payload,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeTransaction(id: string) {
    const user = await getCurrentUser()
    if (!user || user.isDemo) return true

    const { error } = await supabase.from('transactions').delete().eq('id', id)

    if (error) throw error
    return true
  },

  async updateTransaction(payload: any) {
    const user = await getCurrentUser()
    if (!user || user.isDemo) return payload

    const { data, error } = await supabase
      .from('transactions')
      .update({
        amount: payload.amount,
        type: payload.type,
      })
      .eq('id', payload.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async fetchFixedCosts() {
    const user = await getCurrentUser()
    if (!user || user.isDemo) return []

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
      return {
        ...payload,
        id: crypto.randomUUID(),
      }
    }

    const { data, error } = await supabase
      .from('fixed_costs')
      .insert({
        ...payload,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async removeFixedCost(id: string) {
    const user = await getCurrentUser()
    if (!user || user.isDemo) return true

    const { error } = await supabase.from('fixed_costs').delete().eq('id', id)

    if (error) throw error
    return true
  },

  async updateFixedCost(payload: any) {
    const user = await getCurrentUser()
    if (!user || user.isDemo) return payload

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
