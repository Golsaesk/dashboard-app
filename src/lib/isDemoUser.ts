import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export async function isDemoUser() {
  const user = await getCurrentUser()
  return user?.isDemo === true
}