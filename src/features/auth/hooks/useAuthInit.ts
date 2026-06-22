'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@supabase/supabase-js'
import { supabase, supabaseConfigured } from '@/lib/supabase/client'

type Plan = 'free' | 'pro'

async function resolveAuthState(user: User | null) {
  let plan: Plan = 'free'

  const isDemo = user?.is_anonymous === true

  if (user && !isDemo) {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()

      plan = (data?.plan as Plan) ?? 'free'
    } catch {
      plan = 'free'
    }
  }

  return {
    user,
    plan,
  }
}

export function useAuthInit() {
  const setAuth = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    if (!supabaseConfigured) {
      console.error('[Auth] Missing Supabase configuration. Check .env.local.')

      setAuth({
        user: null,
        plan: 'free',
        loading: false,
      })

      return
    }

    let mounted = true

    async function initialize() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        const user = session?.user ?? null

        const { plan } = await resolveAuthState(user)

        if (!mounted) return

        setAuth({
          user,
          plan,
          loading: false,
        })
      } catch (error) {
        console.error('[Auth] Initialization failed:', error)

        if (!mounted) return

        setAuth({
          user: null,
          plan: 'free',
          loading: false,
        })
      }
    }

    initialize()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      const user = session?.user ?? null

      try {
        const { plan } = await resolveAuthState(user)

        if (!mounted) return

        setAuth({
          user,
          plan,
          loading: false,
        })
      } catch (error) {
        console.error('[Auth] State change failed:', error)

        if (!mounted) return

        setAuth({
          user,
          plan: 'free',
          loading: false,
        })
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setAuth])
}
