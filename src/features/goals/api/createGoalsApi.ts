import { supabase } from '@/lib/supabase/client'

export async function createGoal(goal: {
  title: string
  target_amount: number
}) {
  const { data, error } = await supabase.from('goals').insert(goal)

  if (error) throw error
  return data
}
