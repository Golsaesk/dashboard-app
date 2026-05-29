'use client'

import { supabase } from '@/lib/supabase/client'
import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = {
  user: any
  loading: boolean
  isAnonymous: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAnonymous: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null),
    [loading, setLoading] = useState(true),
    [isAnonymous, setIsAnonymous] = useState(false)

  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      setLoading(true)

      // 1. check existing session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        if (!mounted) return

        setUser(session.user)
        setIsAnonymous(session.user.is_anonymous ?? false)
        setLoading(false)
        return
      }

      // 2. no session → create anonymous user
      const { data, error } = await supabase.auth.signInAnonymously()

      if (error) {
        console.log('Anonymous auth error:', error)
        if (!mounted) return

        setUser(null)
        setIsAnonymous(false)
        setLoading(false)
        return
      }

      if (!mounted) return

      setUser(data.user)
      setIsAnonymous(true)
      setLoading(false)
    }

    initAuth()

    // 3. listen to auth changes (important)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsAnonymous(session?.user?.is_anonymous ?? false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAnonymous,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
