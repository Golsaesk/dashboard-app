import { supabase } from '@/lib/supabase/client'

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: 'https://dashboard-app-9u85.vercel.app/callback',
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
