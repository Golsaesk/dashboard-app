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
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('User not authenticated')

  const { error } = await supabase.from('goals').insert([
    {
      title,
      target_amount,
      saved_amount: saved, 
      user_id: user.id,
    },
  ])

  if (error) throw error
}
