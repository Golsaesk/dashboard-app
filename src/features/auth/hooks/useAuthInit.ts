'use client'

import { useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase/client'

type Plan = 'free' | 'pro'
async function resolveAuthState(user: User | null) {
  const isDemo = user?.is_anonymous === true
  let plan: Plan = 'free'

  if (user && !isDemo) {
    const { data } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()
    plan = data?.plan ?? 'free'
  }

  return { user, plan }
}

export function useAuthInit() {
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { plan } = await resolveAuthState(user)
      setAuth({ user, plan, loading: false })
    }

    init()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      const { plan } = await resolveAuthState(user)
      setAuth({ user, plan, loading: false })
    })

    return () => subscription.unsubscribe()
  }, [setAuth])
}
