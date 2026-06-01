export type Transaction = {
  id: string
  amount: number
  type: 'income' | 'outcome'
  date?: string
  category?: string
}
