'use client'

import { useAuthStore } from '@/store/authStore'

export function FeatureGate({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const plan = useAuthStore((s) => s.plan)

  if (plan !== 'pro') {
    return (
      fallback ?? (
        <div className="p-4 text-center text-gray-500">
          This feature is for Pro users only 🚀
        </div>
      )
    )
  }

  return <>{children}</>
}
