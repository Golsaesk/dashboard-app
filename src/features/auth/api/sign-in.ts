import { supabase } from '@/lib/supabase/client'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      throw new Error('Incorrect email or password.')
    }
    if (error.message.includes('Email not confirmed')) {
      throw new Error('Please verify your email first.')
    }
    throw new Error(error.message)
  }

  return data
}
