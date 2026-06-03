import { supabase } from '@/lib/supabase/client'

export type FixedCost = {
  id: string
  title: string
  amount: number
  due_day: number
}

type NewFixedCost = Omit<FixedCost, 'id'>

const DEMO_KEY = 'demo_fixed_costs'

function getDemo(): FixedCost[] {
  try {
    return JSON.parse(localStorage.getItem(DEMO_KEY) || '[]')
  } catch {
    return []
  }
}
function saveDemo(data: FixedCost[]): void {
  localStorage.setItem(DEMO_KEY, JSON.stringify(data))
}

async function getUserId(): Promise<string | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user?.id ?? null
}
function isDemo(): boolean {
  try {
    const raw = localStorage.getItem(
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`,
    )
    return JSON.parse(raw ?? 'null')?.user?.is_anonymous === true
  } catch {
    return false
  }
}

export async function getFixedCosts(): Promise<FixedCost[]> {
  if (isDemo()) return getDemo()
  const userId = await getUserId()
  if (!userId) return []
  const { data, error } = await supabase
    .from('fixed_costs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as FixedCost[]
}

export async function addFixedCost(payload: NewFixedCost): Promise<FixedCost> {
  if (isDemo()) {
    const item: FixedCost = { ...payload, id: crypto.randomUUID() }
    saveDemo([item, ...getDemo()])
    return item
  }
  const userId = await getUserId()
  if (!userId) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('fixed_costs')
    .insert({ ...payload, user_id: userId })
    .select()
    .single()
  if (error) throw error
  return data as FixedCost
}

export async function removeFixedCost(id: string): Promise<void> {
  if (isDemo()) {
    saveDemo(getDemo().filter((c) => c.id !== id))
    return
  }
  const { error } = await supabase.from('fixed_costs').delete().eq('id', id)
  if (error) throw error
}
