'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import ThemeProvider from '@/providers/themeProvider'

export default function Home() {
  const router = useRouter()

  async function handleDemo() {
    const { error } = await supabase.auth.signInAnonymously()
    if (!error) router.push('/dashboard')
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-zinc-950">
        <div className="flex max-w-xl flex-col items-center gap-4 text-center">
          <h1 className="text-4xl leading-tight font-bold text-zinc-900 md:text-5xl dark:text-white">
            Stop guessing. <br />
            <span className="text-emerald-500">
              Understand your money with AI.
            </span>
          </h1>

          <p className="text-base text-zinc-500 md:text-lg dark:text-zinc-400">
            Track your income and expenses, and get instant AI-powered insights
            on where your money goes — just like a personal financial advisor.
          </p>

          <div className="mt-4 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <p>• Detect unusual spending patterns</p>
            <p>• Get smart insights about your habits</p>
            <p>• Visualize your financial behavior</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={handleDemo}
            className="rounded-xl bg-emerald-500 px-7 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            🚀 Analyze My Spending (Demo)
          </button>

          <button
            onClick={() => router.push('/signin')}
            className="rounded-xl border border-zinc-200 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Sign Up / Login
          </button>
        </div>

        <p className="mt-6 text-xs text-zinc-400 dark:text-zinc-500">
          Demo includes pre-filled data & AI insights for a real experience
        </p>
      </div>
    </ThemeProvider>
  )
}
