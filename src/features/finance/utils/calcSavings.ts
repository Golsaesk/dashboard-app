import { Transaction } from '@/type/transaction'

export function calculateSavings(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => {
    if (t.type === 'income') return acc + Number(t.amount)
    if (t.type === 'expense') return acc - Number(t.amount)
    return acc
  }, 0)
}
