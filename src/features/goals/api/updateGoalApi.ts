import { supabase } from '@/lib/supabase/client'

export async function updateGoalSaved({
  id,
  saved,
}: {
  id: string
  saved: number
}): Promise<void> {
  const { error } = await supabase
    .from('goals')
    .update({ saved_amount: saved })
    .eq('id', id)
  if (error) throw new Error(error.message)
}
