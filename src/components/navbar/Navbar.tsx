'use client'

import MenuContent from './MenuContent'
import { Bell, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { mobileMenuItems } from '@/data/menu/menu.config'

const titles: Record<string, string> = {
  '/': 'Dashboard',
  '/reports': 'Reports',
  '/income': 'Income',
  '/outcome': 'Outcome',
  '/setting': 'Setting',
  '/profile': 'Profile',
}
export default function Navbar() {
  const [open, setOpen] = useState(false),
    [userName, setUserName] = useState(''),
    pathname = usePathname(),
    title = titles[pathname] || 'Dashboard'

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
    <>
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => setOpen(true)} className="lg:hidden">
          <Menu />
        </button>
        <div>
          <h1 className="text-xl font-bold text-zinc-900">{title}</h1>
          <p className="text-sm text-zinc-500">
            Welcome back, {userName || '...'} 👋
          </p>
        </div>
        <Bell />
      </header>
      <MenuContent
        items={mobileMenuItems}
        mode="mobile"
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
