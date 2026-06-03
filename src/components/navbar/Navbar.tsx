'use client'

import MenuContent from './MenuContent'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import NotificationPopup from './NotificationPopup'
import { Bell, BellRing, Menu } from 'lucide-react'
import { mobileMenuItems } from '@/config/menu.config'
import { useNotifications } from '@/hooks/useNotifications'
import { useAuthStore } from '@/store/authStore'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/reports': 'Reports',
  '/income': 'Income',
  '/outcome': 'Outcome',
  '/setting': 'Setting',
  '/profile': 'Profile',
}

function getUserDisplayName(
  user: { email?: string; user_metadata?: Record<string, string> } | null,
): string {
  if (!user) return ''
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User'
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false),
    user = useAuthStore((s) => s.user),
    userName = getUserDisplayName(user),
    pathname = usePathname(),
    title = titles[pathname] || 'Dashboard'

  const {
    notifications,
    unreadCount,
    open: notifOpen,
    setOpen: setNotifOpen,
    markAsRead,
    markAllAsRead,
  } = useNotifications()

  return (
    <>
      <header className="relative flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
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

        <button
          onClick={() => setNotifOpen(true)}
          className="relative rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          {unreadCount > 0 ? <BellRing size={20} /> : <Bell size={20} />}

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </button>

        <NotificationPopup
          open={notifOpen}
          notifications={notifications}
          onClose={() => setNotifOpen(false)}
          onClick={markAsRead}
          onMarkAll={markAllAsRead}
        />
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
