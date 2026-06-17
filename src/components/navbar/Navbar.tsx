'use client'

import { useState } from 'react'
import MenuContent from './MenuContent'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import NotificationPopup from './NotificationPopup'
import { mobileMenuItems } from '@/config/menu.config'
import { useNotifications } from '@/hooks/useNotifications'
import {
  Bell,
  BellRing,
  Menu,
  Search,
  SlidersHorizontal,
  Calendar,
  ChevronDown,
} from 'lucide-react'

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
      <header className="flex items-center justify-between gap-3 px-4 py-4 md:px-6 md:py-5 lg:px-8">
        <button
          onClick={() => setOpen(true)}
          className="bg-card text-muted-foreground hover:bg-accent flex h-10 w-10 items-center justify-center rounded-xl shadow-sm transition lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="hidden flex-1 sm:block">
          <h1 className="text-foreground text-xl font-semibold md:text-2xl">
            Welcome back, {userName || '...'} 👋
          </h1>
        </div>

        <h1 className="text-foreground flex-1 text-lg font-semibold sm:hidden">
          {title}
        </h1>

        <div className="flex items-center gap-2">
          <button className="bg-card text-muted-foreground hover:bg-accent hidden h-10 w-10 items-center justify-center rounded-full shadow-sm transition sm:flex">
            <Search size={18} />
          </button>

          <button className="bg-primary text-primary-foreground hidden h-10 w-10 items-center justify-center rounded-full shadow-sm transition hover:opacity-90 sm:flex">
            <SlidersHorizontal size={18} />
          </button>

          <button className="bg-card text-muted-foreground hover:bg-accent hidden h-10 w-10 items-center justify-center rounded-full shadow-sm transition sm:flex">
            <Calendar size={18} />
          </button>

          <button
            onClick={() => setNotifOpen(true)}
            className="bg-card text-muted-foreground hover:bg-accent relative flex h-10 w-10 items-center justify-center rounded-full shadow-sm transition"
          >
            {unreadCount > 0 ? <BellRing size={18} /> : <Bell size={18} />}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            )}
          </button>

          <button className="bg-card hover:bg-accent hidden items-center gap-2 rounded-full px-2 py-1.5 shadow-sm transition lg:flex">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
              {(userName || 'U').slice(0, 1).toUpperCase()}
            </div>
            <div className="pr-1 text-left">
              <p className="text-foreground text-sm leading-tight font-medium">
                {userName || 'User'}
              </p>
              <p className="text-muted-foreground text-xs leading-tight">
                {user?.email}
              </p>
            </div>
            <ChevronDown size={16} className="text-muted-foreground" />
          </button>
        </div>

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
