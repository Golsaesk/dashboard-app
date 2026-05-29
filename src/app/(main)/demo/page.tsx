'use client'

import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

type Message = {
  id: string
  content: string
}

export default function DemoPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) console.log(error)
        setUserId(data.user?.id ?? null)
      } else {
        setUserId(session.user.id)
      }
    }

    init()
  }, [])

  // load messages
  useEffect(() => {
    if (!userId) return

    const load = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      setMessages(data || [])
    }

    load()
  }, [userId])

  const sendMessage = async () => {
    if (!text.trim() || !userId) return

    const { data } = await supabase.from('messages').insert({
      content: text,
      user_id: userId,
    })

    setText('')

    // refresh
    const { data: refreshed } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })

    setMessages(refreshed || [])
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Demo Mode</h1>

      <div className="mb-4 flex gap-2">
        <input
          className="flex-1 rounded border p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="پیام خود را بنویس..."
        />
        <button
          onClick={sendMessage}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          ارسال
        </button>
      </div>

      <div className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="rounded border p-2">
            {m.content}
          </div>
        ))}
      </div>
    </div>
  )
}
