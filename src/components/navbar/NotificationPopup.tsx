'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { CheckCheck, X } from 'lucide-react'
import { Notification } from '@/hooks/useNotifications'
import { motion, AnimatePresence } from 'framer-motion'

export default function NotificationPopup({
  open,
  notifications,
  onClose,
  onClick,
  onMarkAll,
}: {
  open: boolean
  notifications: Notification[]
  onClose: () => void
  onClick: (id: string) => void
  onMarkAll: () => void
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
          />

          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed top-14 right-4 z-50 w-96 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                Notifications
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={onMarkAll}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all
                </button>

                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-auto p-2">
              {notifications.length === 0 ? (
                <div className="py-10 text-center text-sm text-zinc-500">
                  No notifications
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <motion.button
                      key={n.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onClick(n.id)}
                      className={`w-full rounded-xl border p-3 text-left transition ${
                        n.read
                          ? 'border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900'
                          : 'border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/40'
                      } `}
                    >
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                          {n.title}
                        </p>
                        <span className="text-[10px] opacity-60">
                          {n.category}
                        </span>
                      </div>

                      <p className="mt-1 text-xs text-zinc-500">{n.message}</p>

                      {!n.read && (
                        <span className="mt-2 inline-block h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
