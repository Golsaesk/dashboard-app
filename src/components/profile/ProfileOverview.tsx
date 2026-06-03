'use client'

import { ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function ProfileOverview() {
  const user = useAuthStore((s) => s.user)

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User'

  const userEmail = user?.email || ''

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 shadow-sm dark:border-zinc-800">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
          {initials || '?'}
        </div>
        <div className="flex flex-col text-zinc-600 dark:text-zinc-300">
          <span className="font-medium">{userName || '...'}</span>
          <span className="text-sm text-zinc-400 dark:text-zinc-500">
            {userEmail}
          </span>
        </div>
      </div>

      <ChevronRight className="text-zinc-400 dark:text-zinc-500" />
    </div>
  )
}
