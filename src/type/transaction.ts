export type Transaction = {
  id: string
  amount: number
  type: 'income' | 'expense' | 'cost'
  date?: string
  category: string
  created_at: number | Date
  attachment?: File | string
  description?: string
  source?: string
  note?: string
}
