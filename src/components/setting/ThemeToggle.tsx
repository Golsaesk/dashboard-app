'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme(),
    isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  )
}
