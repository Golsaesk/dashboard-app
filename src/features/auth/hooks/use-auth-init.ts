'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAppMode } from '@/store/appmodeStore'

export function useAuthInit() {
  const { setMode } = useAppMode()

  useEffect(() => {
    let mounted = true

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!mounted) return

      if (user) {
        setMode('auth')
      } else {
        setMode('demo')
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return

      if (session?.user) {
        setMode('auth')
      } else {
        setMode('demo')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [setMode])
}
