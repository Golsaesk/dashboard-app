export type Transaction = {
  id: string
  name: string
  amount: number
  type: 'income' | 'outcome'
  date?: string
}
