'use client'

import { useAuthInit } from '@/features/auth/hooks/useAuthInit'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthInit()

  return <>{children}</>
}