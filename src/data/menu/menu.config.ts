import {
  UserIcon,
  SettingsIcon,
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  ChartColumn,
  Plus,
} from 'lucide-react'

import { MenuItem } from './menu'

export const desktopMenuItems = (onAdd: () => void): MenuItem[] => [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Income', path: '/income', icon: ArrowDownCircle },
  { label: 'Outcome', path: '/outcome', icon: ArrowUpCircle },
  { label: 'Report', path: '/reports', icon: ChartColumn },
  { label: 'Profile', path: '/profile', icon: UserIcon },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
  { type: 'add', label: 'Add Transaction', icon: Plus },
]

export const mobileMenuItems: MenuItem[] = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Profile', path: '/profile', icon: UserIcon },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
]
