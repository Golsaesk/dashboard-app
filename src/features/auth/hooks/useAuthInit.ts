'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'

export function useAuthInit() {
  const setAuth = useAuthStore((s) => s.setAuth)

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      const isDemo = user?.is_anonymous === true

      let plan: 'free' | 'pro' = 'free'

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

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null
      const isDemo = user?.is_anonymous === true

      let plan: 'free' | 'pro' = 'free'

      if (user && !isDemo) {
        const { data } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', user.id)
          .single()

        plan = data?.plan ?? 'free'
      }

      setAuth({ user, session, plan, loading: false })
    })

    return () => subscription.unsubscribe()
  }, [setAuth])
}
