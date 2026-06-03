import type { LucideIcon } from 'lucide-react'

export type SettingToggleKey = 'darkMode' | 'notifications'
export type SettingButtonKey = 'editProfile' | 'logout' | 'deleteAccount'

export type SettingItemBase = {
  id: number
  title: string
  description: string
  icon: LucideIcon
}

export type ToggleSettingItem = SettingItemBase & {
  type: 'toggle'
  value: boolean
  key: SettingToggleKey
}

export type ButtonSettingItem = SettingItemBase & {
  type: 'button'
  key?: SettingButtonKey
  onClick?: () => void
  variant?: 'default' | 'danger'
}

export type SettingItem = {
  id: number
  title: string
  description: string
  icon: LucideIcon
  type: 'toggle' | 'button' | 'select'
  key: string
  value?: boolean | string
  options?: string[]
  variant?: 'danger'
  onClick?: () => void
}

export type SettingsSection = {
  title: string
  items: SettingItem[]
}
