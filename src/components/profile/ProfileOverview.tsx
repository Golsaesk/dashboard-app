'use client'

import { ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export default function ProfileOverview() {
  const [userName, setUserName] = useState<string>(''),
    [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) return

      const user = data.session?.user

      if (user) {
        setUserName(
          user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'User',
        )

        setUserEmail(user.email || '')
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user

      if (user) {
        setUserName(
          user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'User',
        )
        setUserEmail(user.email || '')
      } else {
        setUserName('Guest')
        setUserEmail('')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gray-500" />

        <div className="flex flex-col text-zinc-600">
          <span>{userName || '...'}</span>
          <span className="text-sm text-zinc-400">{userEmail || ''}</span>
        </div>
      </div>

      <ChevronRight className="text-zinc-600" />
    </div>
  )
}
