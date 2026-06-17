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
            className="card-shadow-md bg-card fixed top-16 right-4 z-50 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-2xl"
          >
            <div className="border-border flex items-center justify-between border-b px-4 py-3">
              <p className="text-foreground text-sm font-semibold">
                Notifications
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={onMarkAll}
                  className="text-muted-foreground hover:bg-accent flex items-center gap-1 rounded-lg px-2 py-1 text-xs"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all
                </button>

                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:bg-accent rounded-lg p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-auto p-2">
              {notifications.length === 0 ? (
                <div className="text-muted-foreground py-10 text-center text-sm">
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
                      className={`w-full rounded-xl p-3 text-left transition ${
                        n.read ? 'bg-card' : 'bg-primary/5'
                      } `}
                    >
                      <div className="flex justify-between">
                        <p className="text-foreground text-sm font-medium">
                          {n.title}
                        </p>
                        <span className="text-muted-foreground text-[10px] opacity-80">
                          {n.category}
                        </span>
                      </div>

                      <p className="text-muted-foreground mt-1 text-xs">
                        {n.message}
                      </p>

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
