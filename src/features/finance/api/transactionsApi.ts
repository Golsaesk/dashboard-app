import { supabase } from '@/lib/supabase/client'

export async function getTransactions() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  return data
}
