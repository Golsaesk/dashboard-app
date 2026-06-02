import { LucideIcon } from 'lucide-react'

export type SummaryCartsItem = {
  name: string
  total?: number
  value?: number | string
  compared?: number
  icon?: LucideIcon
}
