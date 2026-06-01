'use client'

import { useRouter } from 'next/navigation'
import ThemeProvider from '@/providers/themeProvider'

export default function Home() {
  const router = useRouter()

  return (
    <ThemeProvider>
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-4xl font-semibold text-zinc-900 dark:text-white">
            Finance Dashboard
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Rule your financial life
          </p>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => router.push('/dashboard?mode=demo')}
            className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Get a Demo
          </button>

          <button
            onClick={() => router.push('/signin')}
            className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Sign Up / Login
          </button>
        </div>
      </div>
    </ThemeProvider>
  )
}
