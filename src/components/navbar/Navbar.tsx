'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import MenuContent from './MenuContent'
import { menuItems } from '@/data/menu/menu.config'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/reports': 'Reports',
  '/income': 'Income',
  '/outcome': 'Outcome',
  '/setting': 'Setting',
  '/profile': 'Profile',
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const pathname = usePathname()

  const title = titles[pathname] || 'Dashboard'

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession()
      const user = data.session?.user

      if (user) {
        setUserName(
          user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'User',
        )
      }
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const user = session?.user
        setUserName(user?.email?.split('@')[0] || 'Guest')
      },
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <header className="flex items-center justify-between px-6 py-5">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setOpen(true)} className="lg:hidden">
          <Menu className="text-zinc-600" />
        </button>

        <div>
          <h1 className="text-xl font-bold text-zinc-900">{title}</h1>
          <p className="text-sm text-zinc-500">
            Welcome back, {userName || '...'} 👋
          </p>
        </div>
      </div>

      <Bell className="text-zinc-500" />

      {/* MOBILE DRAWER ONLY */}
      <MenuContent
        items={menuItems}
        isOpen={open}
        onClose={() => setOpen(false)}
        mode="mobile"
      />
    </header>
  )
}
