'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeSync() {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    if (!resolvedTheme) return
    setTheme(resolvedTheme)
  }, [resolvedTheme, setTheme])

  return null
}
