'use client'

import { useEffect } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'

type Plan = 'free' | 'pro'

type SetAuth = (data: {
  user: User | null
  session: Session | null
  plan: Plan
  loading: boolean
}) => void

async function resolveAuthState(
  user: User | null,
  session: Session | null,
  setAuth: SetAuth,
) {
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

  setAuth({ user, session, plan, loading: false })
}

export function useAuthInit() {
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      await resolveAuthState(session?.user ?? null, session, setAuth)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await resolveAuthState(session?.user ?? null, session, setAuth)
    })

    return () => subscription.unsubscribe()
  }, [setAuth])
}
