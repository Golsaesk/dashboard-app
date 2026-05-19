'use server'

import { transactionSchema } from './schema'

export async function createTransaction(data: unknown) {
  const parsed = transactionSchema.parse(data)

  console.log('saved:', parsed)

  return { success: true }
}


