export type TransactionType = {
  id: string
  name: string
  date: string
  amount: number
  type: 'income' | 'expense'
}