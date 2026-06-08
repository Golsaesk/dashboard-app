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
async function getAuthState(): Promise<{
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

// ─── Public API ───────────────────────────────────────────────────────────

export async function getFixedCosts(): Promise<FixedCost[]> {
  const { userId, isDemo } = await getAuthState()

  if (isDemo) return getDemo()
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
  const { userId, isDemo } = await getAuthState()

  if (isDemo) {
    const item: FixedCost = { ...payload, id: crypto.randomUUID() }
    saveDemo([item, ...getDemo()])
    return item
  }

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
  const { userId, isDemo } = await getAuthState()

  if (isDemo) {
    saveDemo(getDemo().filter((c) => c.id !== id))
    return
  }

  if (!userId) throw new Error('Not authenticated')

  // RLS این رو enforce می‌کنه، ولی user_id چک صریح امنیت بیشتری میده
  const { error } = await supabase
    .from('fixed_costs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}
