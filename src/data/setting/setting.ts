import type { LucideIcon } from 'lucide-react'

export type SettingToggleKey = 'darkMode' | 'notifications'

export type SettingButtonKey = 'editProfile'

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
  key: SettingButtonKey
  onClick?: () => void
}

export type SettingItem = ToggleSettingItem | ButtonSettingItem

export type SettingsSection = {
  title: string
  items: SettingItem[]
}
