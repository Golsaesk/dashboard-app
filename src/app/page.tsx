'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ThemeProvider from '@/providers/themeProvider'
import { supabase, supabaseConfigured } from '@/lib/supabase/client'

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  async function handleDemo() {
    setErrorMsg(null)

    if (!supabaseConfigured) {
      setErrorMsg(
        'Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and ' +
          'NEXT_PUBLIC_SUPABASE_ANON_KEY to a .env.local file at the project ' +
          'root, then restart "npm run dev". See .env.local.example.',
      )
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signInAnonymously()

      if (error) {
        setErrorMsg(
          error.message ||
            'Could not start the demo. Please check your connection and try again.',
        )
        return
      }

      router.push('/dashboard')
    } catch {
      setErrorMsg(
        'Could not reach Supabase. Double-check that NEXT_PUBLIC_SUPABASE_URL ' +
          'is correct and that your Supabase project is active (not paused).',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider>
      <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
          <h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
            Stop guessing. <br />
            <span className="text-primary">Understand your money with AI.</span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg">
            Track your income and expenses, and get instant AI-powered insights
            on where your money goes — just like a personal financial advisor.
          </p>

          <div className="text-muted-foreground mt-4 space-y-1 text-sm">
            <p>• Detect unusual spending patterns</p>
            <p>• Get smart insights about your habits</p>
            <p>• Visualize your financial behavior</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={handleDemo}
            disabled={loading}
            className="bg-primary text-primary-foreground rounded-2xl px-7 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Starting demo…' : '🚀 Analyze My Spending (Demo)'}
          </button>

          <button
            onClick={() => router.push('/signin')}
            className="border-border text-foreground hover:bg-accent rounded-2xl border px-6 py-3 text-sm font-medium transition"
          >
            Sign Up / Login
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 max-w-md rounded-2xl bg-red-500/10 px-4 py-3 text-center text-xs text-red-500">
            {errorMsg}
          </div>
        )}

        {!supabaseConfigured && (
          <p className="text-muted-foreground mt-3 max-w-md text-center text-[11px]">
            Dev note: copy .env.local.example to .env.local and fill in your
            Supabase credentials, then restart the dev server.
          </p>
        )}

        <p className="text-muted-foreground mt-6 text-xs">
          Demo includes pre-filled data & AI insights for a real experience
        </p>
      </div>
    </ThemeProvider>
  )
}
