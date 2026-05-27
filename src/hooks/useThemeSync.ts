'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useSettingsStore } from '@/store/settingStore'

export function useThemeSync() {
  const { theme, setTheme } = useTheme()
  const darkMode = useSettingsStore((s) => s.darkMode)

  useEffect(() => {
    if (!theme) return

    const shouldBeDark = darkMode

    setTheme(shouldBeDark ? 'dark' : 'light')
  }, [darkMode])
}
