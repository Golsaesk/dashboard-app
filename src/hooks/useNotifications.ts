'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { playSound, showToast } from '@/lib/notification/notification'

export type Notification = {
  id: string
  type: 'fix_cost_due' | 'ai_analysis' | 'system'
  title: string
  message: string
  category: 'finance' | 'ai' | 'system'
  read: boolean
  created_at: string
}

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)

  // initial load
  useEffect(() => {
    if (!userId) return

    const load = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      setNotifications(data || [])
    }

    load()
  }, [userId])

  // realtime
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification

          setNotifications((prev) => [newNotif, ...prev])

          playSound()
          showToast(newNotif)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id)

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }

  const markAllAsRead = async () => {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return {
    notifications,
    unreadCount,
    open,
    setOpen,
    markAsRead,
    markAllAsRead,
  }
}
