import { Transaction } from '@/type/transaction'

const COLORS = [
  '#0EA5E9',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
]

export type CategoryChartItem = {
  name: string
  value: number
  color: string
}

export function getCategoryChartData(
  transactions: Transaction[],
): CategoryChartItem[] {
  const grouped: Record<string, number> = {}

  transactions.forEach((transaction) => {
    const key = transaction.category || 'Other'
    grouped[key] = (grouped[key] || 0) + transaction.amount
  })

  return Object.entries(grouped).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }))
}
