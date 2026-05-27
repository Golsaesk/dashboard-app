'use client'

import { useState } from 'react'
import { AuthCard } from '@/features/auth/components/AuthCard'
import { AuthSidePanel } from '@/features/auth/components/AuthSidePanel'

export default function SignIn() {
  const [isSignup, setIsSignup] = useState(false)

  return (
    <div className="grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      <AuthSidePanel />
      <div className="flex items-center justify-center bg-white p-6 dark:bg-zinc-950">
        <AuthCard
          isSignup={isSignup}
          onToggle={() => setIsSignup((prev) => !prev)}
        />
      </div>
    </div>
  )
}
