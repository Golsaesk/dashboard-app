import { supabase } from '@/lib/supabase/client'

export async function updateGoalSaved({
  id,
  saved,
}: {
  id: string
  saved: number
}): Promise<void> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('goals')
    .update({ saved_amount: saved })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) throw new Error(error.message)
}
