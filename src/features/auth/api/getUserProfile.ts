import { supabase } from '@/lib/supabase/client'

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error

  return data
}
