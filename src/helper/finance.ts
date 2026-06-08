import { Transaction } from '@/type/transaction'

function isOutcome(type: Transaction['type']): boolean {
  return type === 'expense' || type === 'cost'
}

export function getTotalIncome(transactions: Transaction[] = []): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
}


export function getTotalOutcome(transactions: Transaction[] = []): number {
  return transactions
    .filter((t) => isOutcome(t.type))
    .reduce((acc, t) => acc + t.amount, 0)
}

export function getTopSource(transactions: Transaction[] = []): string {
  const incomeTransactions = transactions.filter((t) => t.type === 'income')

  if (incomeTransactions.length === 0) return 'No Source'

  const grouped: Record<string, number> = {}

  incomeTransactions.forEach((t) => {
    if (!t.category) return
    grouped[t.category] = (grouped[t.category] || 0) + t.amount
  })

  const entries = Object.entries(grouped)

  if (entries.length === 0) return 'No Source'

  return entries.sort((a, b) => b[1] - a[1])[0][0]
}

export function getMonthlyAverage(transactions: Transaction[] = []): number {
  if (transactions.length === 0) return 0

  const total = transactions.reduce((acc, t) => acc + t.amount, 0)
  return total / transactions.length
}

export function getMostSpend(transactions: Transaction[] = []): string {
  const outcomeTransactions = transactions.filter((t) => isOutcome(t.type))

  if (outcomeTransactions.length === 0) return 'No Spending'

  const grouped: Record<string, number> = {}

  outcomeTransactions.forEach((t) => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount
  })

  return Object.entries(grouped).sort((a, b) => b[1] - a[1])[0][0]
}

export function getNetSaving(transactions: Transaction[] = []): number {
  return getTotalIncome(transactions) - getTotalOutcome(transactions)
}
