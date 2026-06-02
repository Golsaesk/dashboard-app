'use client'

import { useAuthInit } from '@/features/auth/hooks/useAuthInit'
import { useFinanceInit } from '@/features/auth/hooks/useFinanceInit'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthInit()
  useFinanceInit()

  return <>{children}</>
}
