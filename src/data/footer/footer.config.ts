import { FooterItem } from './footer'
import {
  CircleDollarSign,
  CirclePlus,
  ClipboardPlus,
  HomeIcon,
  Wallet,
} from 'lucide-react'

export const footerItems: FooterItem[] = [
  {
    lable: 'Dashboard',
    path: '/dashboard',
    icon: HomeIcon,
  },
  {
    lable: 'Reports',
    path: '/reports',
    icon: ClipboardPlus,
  },
  {
    lable: '',
    path: '/add',
    icon: CirclePlus,
  },
  {
    lable: 'Income',
    path: '/income',
    icon: CircleDollarSign,
  },
  {
    lable: 'Outcome',
    path: '/outcome',
    icon: Wallet,
  },
]
