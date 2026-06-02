'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function useThemeSync() {
  const { setTheme, resolvedTheme } = useTheme()
  const darkMode = resolvedTheme === 'dark'

  useEffect(() => {
    setTheme(darkMode ? 'dark' : 'light')
  }, [darkMode, setTheme])
}
