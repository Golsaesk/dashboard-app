import { supabase } from '@/lib/supabase/client'
import { Transaction } from '@/type/transaction'

const DEMO_KEY = 'demo_transactions'

function getDemoTransactions(): Transaction[] {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY) || '[]')
  } catch {
    return []
  }
}

function saveDemoTransactions(data: Transaction[]): void {
  localStorage.setItem(DEMO_KEY, JSON.stringify(data))
}

async function getVerifiedSession(): Promise<{
  userId: string | null
  isDemo: boolean
}> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return { userId: null, isDemo: false }

  return {
    userId: user.id,
    isDemo: user.is_anonymous === true,
  }
}

export async function getTransactions(): Promise<Transaction[]> {
  const { userId, isDemo } = await getVerifiedSession()

  if (isDemo) return getDemoTransactions()
  if (!userId) return []

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((t) => ({
    ...t,
    type: t.type === 'expense' ? 'expense' : t.type,
  })) as Transaction[]
}

export async function addTransaction(
  payload: Omit<Transaction, 'id'>,
): Promise<Transaction> {
  const { userId, isDemo } = await getVerifiedSession()

  if (isDemo) {
    const item: Transaction = { ...payload, id: crypto.randomUUID() }
    saveDemoTransactions([item, ...getDemoTransactions()])
    return item
  }

  if (!userId) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('transactions')
    .insert({ ...payload, user_id: userId })
    .select()
    .single()

  if (error) throw error
  return data as Transaction
}

export async function removeTransaction(id: string): Promise<void> {
  const { userId, isDemo } = await getVerifiedSession()

  if (isDemo) {
    saveDemoTransactions(getDemoTransactions().filter((t) => t.id !== id))
    return
  }

  if (!userId) throw new Error('Not authenticated')

  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}

export async function updateTransaction(
  payload: Transaction,
): Promise<Transaction> {
  const { userId, isDemo } = await getVerifiedSession()

  if (isDemo) {
    const updated = getDemoTransactions().map((t) =>
      t.id === payload.id ? { ...t, ...payload } : t,
    )
    saveDemoTransactions(updated)
    return payload
  }

  if (!userId) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('transactions')
    .update({
      amount: payload.amount,
      type: payload.type,
      category: payload.category,
      date: payload.date,
    })
    .eq('id', payload.id)
    .select()
    .single()

  if (error) throw error
  return data as Transaction
}
