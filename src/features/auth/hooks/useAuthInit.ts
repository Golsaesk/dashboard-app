'use client'

import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'

export function useAuthInit() {
  const setAuth = useAuthStore((s) => s.setAuth)

  async function init() {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const {
      data: { session },
    } = await supabase.auth.getSession()

    let plan: 'free' | 'pro' = 'free'

    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      plan = data?.plan ?? 'free'
    }

    setAuth({
      user,
      session,
      plan,
      loading: false,
    })
  }

  return { init }
}
