import { supabase } from '@/lib/supabase/client'

export type GoalRow = {
  id: string
  title: string
  target_amount: number
  saved_amount: number
  user_id: string
  created_at?: string
}

async function getUserId(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Not authenticated')
  return session.user.id
}

export async function getGoals(): Promise<GoalRow[]> {
  const userId = await getUserId()
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as GoalRow[]
}
