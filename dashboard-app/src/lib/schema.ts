import { z } from 'zod'

export const transactionSchema = z.object({
  type: z.enum(['income', 'outcome']),
  category: z.string().min(1),
  amount: z.number().positive(),
  date: z.string(),
})

export type TransactionForm = z.infer<typeof transactionSchema>
