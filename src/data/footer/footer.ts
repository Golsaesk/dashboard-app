import { LucideIcon } from 'lucide-react'

export type FooterItem = {
  lable: string
  path: string
  icon: LucideIcon
  type?: 'add' | 'default'
}
