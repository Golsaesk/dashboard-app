

import { z } from 'zod'

export const transactionSchema = z.object({
  amount: z.coerce.number().min(1, 'Amount is required'),

  category: z.string().min(1),

  source: z.string().min(1),

  date: z.date(),

  note: z.string().optional(),

  type: z.enum(['income', 'outcome']),

  attachment: z.any().optional(),
})

export type TransactionSchemaType = z.infer<typeof transactionSchema>
