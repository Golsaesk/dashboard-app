'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase/client'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccountActions } from '@/hooks/useAccountActions'
import {
  LogOut,
  UserPlus,
  Users,
  Check,
  ChevronRight,
  Settings,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react'

type SavedAccount = {
  id: string
  email: string
  name: string
  avatar: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

type Props = {
  open: boolean
  onClose: () => void
}

export default function AccountPopup({ open, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null),
    router = useRouter(),
    user = useAuthStore((s) => s.user),
    { logout, deleteAccount, deleting } = useAccountActions(),
    [showDeleteConfirm, setShowDeleteConfirm] = useState(false),
    [loggingOut, setLoggingOut] = useState(false),
    [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]),
    [switchingTo, setSwitchingTo] = useState<string | null>(null)

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User'
  const userEmail = user?.email || ''
  const initials = getInitials(userName)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('saved_accounts')
      if (raw) setSavedAccounts(JSON.parse(raw) as SavedAccount[])
    } catch {}
  }, [open])

  useEffect(() => {
    if (!open || !user || !user.email) return
    const current: SavedAccount = {
      id: user.id,
      email: user.email,
      name: userName,
      avatar: initials,
    }
    try {
      const raw = localStorage.getItem('saved_accounts')
      const existing: SavedAccount[] = raw ? JSON.parse(raw) : []
      const updated = [
        current,
        ...existing.filter((a) => a.id !== user.id),
      ].slice(0, 5)
      localStorage.setItem('saved_accounts', JSON.stringify(updated))
      setSavedAccounts(updated)
    } catch {}
  }, [open, user, userName, initials])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
        setShowDeleteConfirm(false)
      }
    }
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        setShowDeleteConfirm(false)
      }
    }
    if (open) {
      document.addEventListener('mousedown', handler)
      document.addEventListener('keydown', keyHandler)
    }
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('keydown', keyHandler)
    }
  }, [open, onClose])

  const handleLogout = async () => {
    setLoggingOut(true)
    await logout()
    onClose()
    setLoggingOut(false)
  }

  const handleSwitchAccount = async (account: SavedAccount) => {
    if (account.id === user?.id) return
    setSwitchingTo(account.id)
    await supabase.auth.signOut()
    router.replace(`/signin?email=${encodeURIComponent(account.email)}`)
    onClose()
  }

  const handleAddAccount = async () => {
    await supabase.auth.signOut()
    router.replace('/signin')
    onClose()
  }

  const removeAccount = (id: string) => {
    try {
      const updated = savedAccounts.filter((a) => a.id !== id)
      localStorage.setItem('saved_accounts', JSON.stringify(updated))
      setSavedAccounts(updated)
    } catch {}
  }

  const otherAccounts = savedAccounts.filter((a) => a.id !== user?.id)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="bg-card border-border absolute top-14 right-0 z-50 w-72 rounded-2xl border shadow-2xl"
        >
          <div className="border-border border-b px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-primary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                {initials || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-semibold">
                  {userName}
                </p>
                <p className="text-muted-foreground truncate text-xs">
                  {userEmail}
                </p>
              </div>
              <Check size={16} className="text-primary shrink-0" />
            </div>
          </div>
          {otherAccounts.length > 0 && (
            <div className="border-border border-b">
              <p className="text-muted-foreground px-4 pt-3 pb-1 text-xs font-semibold tracking-wide uppercase">
                Switch account
              </p>
              {otherAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="hover:bg-muted group flex items-center gap-3 px-4 py-2.5 transition"
                >
                  <button
                    onClick={() => handleSwitchAccount(acc)}
                    className="flex flex-1 items-center gap-3"
                    disabled={switchingTo === acc.id}
                  >
                    <div className="bg-muted text-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                      {acc.avatar}
                    </div>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="text-foreground truncate text-sm font-medium">
                        {acc.name}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {acc.email}
                      </p>
                    </div>
                    {switchingTo === acc.id ? (
                      <span className="text-muted-foreground text-xs">
                        Switching…
                      </span>
                    ) : (
                      <ChevronRight
                        size={14}
                        className="text-muted-foreground"
                      />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeAccount(acc.id)
                    }}
                    className="text-muted-foreground hover:text-foreground ml-1 hidden rounded-full p-1 transition group-hover:block"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-0.5 p-2">
            <button
              onClick={handleAddAccount}
              className="text-foreground hover:bg-muted flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition"
            >
              <UserPlus size={16} className="text-muted-foreground" />
              Add another account
            </button>

            <button
              onClick={() => {
                router.push('/setting')
                onClose()
              }}
              className="text-foreground hover:bg-muted flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition"
            >
              <Settings size={16} className="text-muted-foreground" />
              Settings
            </button>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-foreground hover:bg-muted flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition disabled:opacity-60"
            >
              <LogOut size={16} className="text-muted-foreground" />
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-500/10"
              >
                <Trash2 size={16} />
                Delete account
              </button>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/30 dark:bg-red-900/10">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0 text-red-500" />
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    This cannot be undone. All data will be permanently deleted.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 rounded-lg py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteAccount}
                    disabled={deleting}
                    className="flex-1 rounded-lg bg-red-500 py-1.5 text-xs font-medium text-white transition hover:bg-red-600 disabled:opacity-60"
                  >
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            )}
          </div>
          {otherAccounts.length > 0 && (
            <div className="border-border border-t px-4 py-2">
              <button className="text-muted-foreground hover:text-foreground flex w-full items-center justify-center gap-1.5 py-1 text-xs transition">
                <Users size={12} />
                Manage accounts
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
