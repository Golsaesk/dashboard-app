'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { signUp } from '@/features/auth/api/sign-up'

export default function SignUpPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    try {
      setLoading(true)

      const data = await signUp(email, password)

      console.log(data)

      // ✅ redirect
      router.push('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-3"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 px-5 py-3 text-white"
      >
        {loading ? 'Loading...' : 'Sign Up'}
      </button>
    </form>
  )
}
