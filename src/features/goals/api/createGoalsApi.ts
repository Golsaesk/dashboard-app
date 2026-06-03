import { supabase } from '@/lib/supabase/client'

export async function createGoal({
  title,
  target_amount,
  saved,
}: {
  title: string
  target_amount: number
  saved: number
}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('goals')
    .insert([
      { title, target_amount, saved_amount: saved, user_id: session.user.id },
    ])
  if (error) throw error
}
