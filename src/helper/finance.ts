import { Transaction } from '@/type/transaction'

export function getTotalIncome(transactions: Transaction[] = []) {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)
}

export function getTotalOutcome(transactions: Transaction[] = []) {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)
}

export function getBalance(transactions: Transaction[] = []) {
  return getTotalIncome(transactions) - getTotalOutcome(transactions)
}

export function getTopSource(transactions: Transaction[] = []) {
  const incomeTransactions = transactions.filter((t) => t.type === 'income')

  if (incomeTransactions.length === 0) {
    return 'No Source'
  }

  const grouped: Record<string, number> = {}

  incomeTransactions.forEach((t) => {
    if (!t.category) return
    grouped[t.category] = (grouped[t.category] || 0) + t.amount
  })

  const entries = Object.entries(grouped)

  if (entries.length === 0) {
    return 'No Source'
  }

  return entries.sort((a, b) => b[1] - a[1])[0][0]
}

export function getMonthlyAverage(transactions: Transaction[] = []) {
  if (transactions.length === 0) {
    return 0
  }

  const total = transactions.reduce((acc, t) => acc + t.amount, 0)

  return total / transactions.length
}

export function getMostSpend(transactions: Transaction[] = []) {
  const outcomeTransactions = transactions.filter((t) => t.type === 'expense')

  if (outcomeTransactions.length === 0) {
    return 'No Spending'
  }

  const grouped: Record<string, number> = {}

  outcomeTransactions.forEach((t) => {
    grouped[t.category] = (grouped[t.category] || 0) + t.amount
  })

  return Object.entries(grouped).sort((a, b) => b[1] - a[1])[0][0]
}

export function getNetSaving(transactions: Transaction[] = []) {
  return getTotalIncome(transactions) - getTotalOutcome(transactions)
}
