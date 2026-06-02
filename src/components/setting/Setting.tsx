'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useSettingsStore } from '@/store/settingStore'
import EditProfileModal from './modals/EditProfileModal'
import DeleteAccountModal from './modals/DeleteAccountModal'
import { useAccountActions } from '@/hooks/useAccountActions'
import { getSettingsData } from '@/data/setting/setting.config'
import SettingSection from './SettingSections'

export default function Setting() {
  const [openProfile, setOpenProfile] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { theme, setTheme } = useTheme()

  const { notifications, toggleNotifications, currency, setCurrency } =
    useSettingsStore()

  const { logout, deleteAccount, deleting } = useAccountActions()

  const sections = getSettingsData({
    darkMode: theme === 'dark',
    notifications,
    currency,

    onEditProfile: () => setOpenProfile(true),

    onLogout: logout,

    onDeleteAccount: () => setShowDeleteConfirm(true),
  })

  const handleToggle = (key: 'darkMode' | 'notifications') => {
    if (key === 'notifications') {
      toggleNotifications()
      return
    }

    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleSelect = (key: string, value: string) => {
    if (key === 'currency') {
      setCurrency(value as any)
    }
  }

  return (
    <>
      {sections.map((section) => (
        <SettingSection
          key={section.title}
          section={section}
          onToggle={handleToggle}
          onSelect={handleSelect}
        />
      ))}

      <EditProfileModal
        open={openProfile}
        onClose={() => setOpenProfile(false)}
      />

      <DeleteAccountModal
        open={showDeleteConfirm}
        loading={deleting}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={deleteAccount}
      />
    </>
  )
}
