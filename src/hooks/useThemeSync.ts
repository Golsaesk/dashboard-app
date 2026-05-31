'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useSettingsStore } from '@/store/settingStore'

export function useThemeSync() {
  const { theme, setTheme } = useTheme(),
    darkMode = useSettingsStore((s) => s.darkMode)

  useEffect(() => {
    if (!theme) return

    setTheme(darkMode ? 'dark' : 'light')
  }, [darkMode, setTheme, theme])
}
