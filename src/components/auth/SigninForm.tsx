'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from '@/features/auth/api/sign-in'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)

      const data = await signIn(email, password)

      console.log('Logged in:', data.user)

      router.push('/dashboard')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />

      <input
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />

      <button disabled={loading}>{loading ? 'Loading...' : 'Sign in'}</button>
    </form>
  )
}
