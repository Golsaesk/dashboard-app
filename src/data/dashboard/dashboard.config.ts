import { CreditCard, Currency, DollarSign, Wallet } from 'lucide-react'
import { DashboardItem } from './dashboard'

export const dashboardItems: DashboardItem[] = [
  {
    name: 'Total Balance',
    total: 100000,
    compared: 5000,
    icon: DollarSign,
  },
  {
    name: 'Total Expenses',
    total: 50000,
    compared: 2000,
    icon: CreditCard,
  },
  {
    name: 'Total Income',
    total: 100,
    compared: -3000,
    icon: Currency,
  },
  {
    name: 'Saving Rate',
    total: 50000,
    compared: 1000,
    icon: Wallet,
  },
]
