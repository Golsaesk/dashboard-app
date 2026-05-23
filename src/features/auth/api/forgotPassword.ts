import { supabase } from '@/lib/supabase/client'

export async function forgotPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/reset-password',
  })

  if (error) {
    throw error
  }

  return data
}
