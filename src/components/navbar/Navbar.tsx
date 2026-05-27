'use client'

import MenuContent from './MenuContent'
import { Bell, Menu } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { mobileMenuItems } from '@/data/menu/menu.config'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
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
      <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 lg:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Welcome back, {userName || '...'} 👋
          </p>
        </div>

        <button className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">
          <Bell size={20} />
        </button>
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
