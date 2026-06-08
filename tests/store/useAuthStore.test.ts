import { useAuthStore } from '@/store/authStore'
import { describe, it, expect, beforeEach } from 'vitest'
import type { User, Session } from '@supabase/supabase-js'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      session: null,
      plan: 'free',
      loading: true,
    })
  })

  it('has correct initial state', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.plan).toBe('free')
    expect(state.loading).toBe(true)
  })

  it('setAuth updates user', () => {
    const mockUser = { id: 'user-123', email: 'test@test.com' } as User
    useAuthStore.getState().setAuth({ user: mockUser })
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('setAuth updates session', () => {
    const mockSession = { access_token: 'token-abc' } as Session
    useAuthStore.getState().setAuth({ session: mockSession })
    expect(useAuthStore.getState().session).toEqual(mockSession)
  })

  it('setAuth updates loading to false', () => {
    useAuthStore.getState().setAuth({ loading: false })
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('setAuth updates plan to pro', () => {
    useAuthStore.getState().setAuth({ plan: 'pro' })
    expect(useAuthStore.getState().plan).toBe('pro')
  })

  it('setAuth merges partial updates without overwriting others', () => {
    const mockUser = { id: 'user-1', email: 'a@b.com' } as User
    useAuthStore.getState().setAuth({ user: mockUser })
    useAuthStore.getState().setAuth({ loading: false })

    const state = useAuthStore.getState()
    expect(state.user).toEqual(mockUser)
    expect(state.loading).toBe(false)
  })
})
