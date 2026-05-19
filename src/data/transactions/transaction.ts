export type Transaction = {
  id: string
  title: string
  amount: number
  type: "income" | "outcome"
  createdAt: string
}