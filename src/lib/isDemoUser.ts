import { supabase } from '@/lib/supabase/client'

export async function isDemoUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user?.is_anonymous === true
}
