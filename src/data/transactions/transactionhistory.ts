export type TransactionHistoryType = {
  id: number
  amount: number
  name: string
  date: string
  type?: 'income' | 'outcome'
}
