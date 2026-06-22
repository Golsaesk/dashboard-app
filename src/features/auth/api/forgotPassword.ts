import { supabase } from '@/lib/supabase/client'

export async function forgotPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://dashboard-app-9u85.vercel.app/reset-password',
  })

  if (error) {
    throw error
  }

  return data
}
