import { LucideIcon } from 'lucide-react'

export type MenuItem = {
  label: string
  path?: string
  icon: LucideIcon
  type?: 'add' | 'default'
}
