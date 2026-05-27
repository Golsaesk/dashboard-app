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

  if (!data.user) {
    throw new Error('User was not created')
  }

  await supabase.from('profiles').insert({
    user_id: data.user.id,
    plan: 'free',
    is_subscribed: false,
  })

  return data
}
