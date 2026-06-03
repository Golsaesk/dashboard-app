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

function isDemo(): boolean {
  const raw = localStorage.getItem(
    `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`,
  )
  try {
    const session = JSON.parse(raw ?? 'null')
    return session?.user?.is_anonymous === true
  } catch {
    return false
  }
}

async function getUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}

export async function getTransactions(): Promise<Transaction[]> {
  if (isDemo()) return getDemoTransactions()

  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((t) => ({
    ...t,
    type: t.type === 'expense' ? 'outcome' : t.type,
  })) as Transaction[]
}

export async function addTransaction(
  payload: Omit<Transaction, 'id'>,
): Promise<Transaction> {
  if (isDemo()) {
    const item: Transaction = { ...payload, id: crypto.randomUUID() }
    saveDemoTransactions([item, ...getDemoTransactions()])
    return item
  }

  const userId = await getUserId()
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
  if (isDemo()) {
    saveDemoTransactions(getDemoTransactions().filter((t) => t.id !== id))
    return
  }

  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}

export async function updateTransaction(
  payload: Transaction,
): Promise<Transaction> {
  if (isDemo()) {
    const updated = getDemoTransactions().map((t) =>
      t.id === payload.id ? { ...t, ...payload } : t,
    )
    saveDemoTransactions(updated)
    return payload
  }

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
