'use client'

import { useState } from 'react'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { AuthSidePanel } from '@/features/auth/components/AuthSidePanel'

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false)

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden bg-zinc-950 lg:grid-cols-2">
      <AuthSidePanel />
      <div className="flex items-center justify-center bg-white p-6">
        <AuthCard
          isSignup={isSignup}
          onToggle={() => setIsSignup((prev) => !prev)}
        />
      </div>
    </div>
  )
}
