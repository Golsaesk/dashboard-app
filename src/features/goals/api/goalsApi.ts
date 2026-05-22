import { supabase } from '@/lib/supabase/client'

export async function getGoals() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  return data
}

export async function createGoal({
  title,
  target_amount,
}: {
  title: string
  target_amount: number
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('goals')
    .insert([
      {
        title,
        target_amount,
        user_id: user.id,
      },
    ])
    .select()

  if (error) {
    throw error
  }

  return data
}
