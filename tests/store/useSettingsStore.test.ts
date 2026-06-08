import { useSettingsStore } from '@/store/settingStore'
import { describe, it, expect, beforeEach } from 'vitest'

describe('useSettingsStore', () => {
  beforeEach(() => {
    useSettingsStore.setState({
      notifications: true,
      currency: 'USD',
    })
  })

  it('has correct initial state', () => {
    const state = useSettingsStore.getState()
    expect(state.notifications).toBe(true)
    expect(state.currency).toBe('USD')
  })

  it('toggleNotifications turns notifications off', () => {
    useSettingsStore.getState().toggleNotifications()
    expect(useSettingsStore.getState().notifications).toBe(false)
  })

  it('toggleNotifications turns notifications back on', () => {
    useSettingsStore.getState().toggleNotifications()
    useSettingsStore.getState().toggleNotifications()
    expect(useSettingsStore.getState().notifications).toBe(true)
  })

  it('setCurrency updates currency to EUR', () => {
    useSettingsStore.getState().setCurrency('EUR')
    expect(useSettingsStore.getState().currency).toBe('EUR')
  })

  it('setCurrency updates currency to TRY', () => {
    useSettingsStore.getState().setCurrency('TRY')
    expect(useSettingsStore.getState().currency).toBe('TRY')
  })

  it('setCurrency updates currency back to USD', () => {
    useSettingsStore.getState().setCurrency('EUR')
    useSettingsStore.getState().setCurrency('USD')
    expect(useSettingsStore.getState().currency).toBe('USD')
  })
})
