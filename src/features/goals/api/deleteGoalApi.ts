import { supabase } from '@/lib/supabase/client'

export async function deleteGoal(id: string) {
  const { error } = await supabase.from('goals').delete().eq('id', id)

  if (error) throw error
  return true
}
