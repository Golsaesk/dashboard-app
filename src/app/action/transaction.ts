'use server'

import { transactionSchema } from "@/lib/schema"
import { supabaseAdmin } from "@/lib/supabase/admin"


export async function createTransaction(data: unknown, userId: string) {
  const parsed = transactionSchema.parse(data)

  const { data: result, error } = await supabaseAdmin
    .from('transactions')
    .insert({
      ...parsed,
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    console.error('SERVER ACTION ERROR:', error)
    throw new Error('Failed to create transaction')
  }

  return result
}
