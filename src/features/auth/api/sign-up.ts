import { supabase } from '@/lib/supabase/client'

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,

    options: {
      emailRedirectTo: 'http://localhost:3000/callback',
    },
  })

  if (error) {
    throw error
  }

  return data
}
