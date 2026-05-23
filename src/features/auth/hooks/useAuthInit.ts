'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store/authStore'
import { useAppMode } from '@/store/appmodeStore'

export function useAuthInit() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const setMode = useAppMode((s) => s.setMode)

  useEffect(() => {
    let mounted = true

    async function init() {
      // 1. get session (single source of truth)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!mounted) return

      const user = session?.user ?? null

      // 2. set auth state
      setAuth({
        user,
        session,
        loading: false,
      })

      // 3. set mode
      setMode(user ? 'auth' : 'demo')
    }

    init()

    // 4. listen for changes (IMPORTANT)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null

      setAuth({
        user,
        session,
        loading: false,
      })

      setMode(user ? 'auth' : 'demo')
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setAuth, setMode])
}
