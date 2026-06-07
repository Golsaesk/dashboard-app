'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { useTransactions } from '@/features/finance/hooks/useTransaction'
import { useFixedCosts } from '@/features/fixedCosts/hooks/useFixedCosts'

export default function DailyReportButton() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const { data: transactions = [] } = useTransactions()
  const { data: fixedCosts = [] } = useFixedCosts()

  async function handleSendReport() {
    setStatus('loading')
    try {
      const res = await fetch('/api/daily-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, fixedCosts }),
      })

      if (!res.ok) throw new Error('Failed')
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <button
      onClick={handleSendReport}
      disabled={status === 'loading'}
      className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
    >
      <Send size={16} />
      {status === 'idle' && 'Send Daily Report'}
      {status === 'loading' && 'Sending...'}
      {status === 'success' && '✓ Sent to Telegram!'}
      {status === 'error' && 'Failed, try again'}
    </button>
  )
}
