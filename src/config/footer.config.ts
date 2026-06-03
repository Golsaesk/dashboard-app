import {
  CircleDollarSign,
  CirclePlus,
  ClipboardPlus,
  HomeIcon,
  Wallet,
} from 'lucide-react'

export type FooterItem = {
  lable: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  type?: 'add'
}

export const footerItems: FooterItem[] = [
  { lable: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { lable: 'Reports', path: '/reports', icon: ClipboardPlus },
  { lable: '', path: '/add', icon: CirclePlus, type: 'add' },
  { lable: 'Income', path: '/income', icon: CircleDollarSign },
  { lable: 'Outcome', path: '/outcome', icon: Wallet },
]
