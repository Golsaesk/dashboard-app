export type TransactionType = {
  id: number
  name: string
  date: string
  amount: number
  type?: 'income' | 'expense'
}
