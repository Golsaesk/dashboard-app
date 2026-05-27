import { supabase } from '@/lib/supabase/client'

export async function getGoals() {
  const { data: userData } = await supabase.auth.getUser()

  if (!userData.user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
