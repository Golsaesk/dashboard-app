'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'

type User = {
  id: string
  email?: string
} | null

export function useAuth() {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function getUser() {
      setLoading(true)

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (!mounted) return

      if (error) {
        console.error(error)
        setUser(null)
      } else {
        setUser(user)
      }

      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}