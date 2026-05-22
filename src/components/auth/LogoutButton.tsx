'use client'

import { signOut } from '@/features/auth/api/logout'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/sign-in')
    } catch (error) {
      console.error(error)
    }
  }

  return <button onClick={handleLogout}>Logout</button>
}
