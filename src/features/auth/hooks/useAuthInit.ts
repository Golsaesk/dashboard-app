'use client'

import { useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { useAuthStore } from '@/store/authStore'
import { supabase, supabaseConfigured } from '@/lib/supabase/client'

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
    if (!supabaseConfigured) {
      console.error(
        '[Auth] Skipping Supabase session check: NEXT_PUBLIC_SUPABASE_URL ' +
          'and/or NEXT_PUBLIC_SUPABASE_ANON_KEY are missing or invalid. ' +
          'Create .env.local from .env.local.example and restart the dev server.',
      )
      setAuth({ user: null, plan: 'free', loading: false })
      return
    }

    let unsubscribe: (() => void) | undefined

    async function init() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const { plan } = await resolveAuthState(user)
        setAuth({ user, plan, loading: false })
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[Auth] Failed to fetch session:', err)
        setAuth({ user: null, plan: 'free', loading: false })
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const user = session?.user ?? null
        const { plan } = await resolveAuthState(user)
        setAuth({ user, plan, loading: false })
      } catch (err) {
        console.error('[Auth] Failed to resolve auth state change:', err)
        setAuth({ user: null, plan: 'free', loading: false })
      }
    })

    unsubscribe = () => subscription.unsubscribe()

    return () => unsubscribe?.()
  }, [setAuth])
}
