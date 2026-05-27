'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import { useSettingsStore } from '@/store/settingStore'

export default function ThemeSync() {
  const darkMode = useSettingsStore((s) => s.darkMode)
  const { setTheme } = useTheme()

  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light')
  }, [darkMode, setTheme])

  return null
}
