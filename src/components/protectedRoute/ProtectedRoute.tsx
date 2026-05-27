'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter(),
    { user, loading } = useAuthStore()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
