import { MenuItem } from './menu'
import { HomeIcon, LayoutDashboard, SettingsIcon, UserIcon } from 'lucide-react'

export const menuItems: MenuItem[] = [
  {
    lable: 'Home',
    path: '/',
    icon: HomeIcon,
  },
  {
    lable: 'Profile',
    path: '/profile',
    icon: UserIcon,
  },
  {
    lable: 'Settings',
    path: '/settings',
    icon: SettingsIcon,
  },
  {
    lable: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
]
