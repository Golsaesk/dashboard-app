import { describe, it, expect } from 'vitest'
import { transactionSchema } from '@/schema/transaction.schema'

describe('transactionSchema', () => {
  const validData = {
    amount: 1000,
    category: 'Food',
    source: 'Cash',
    date: new Date(),
    type: 'expense' as const,
  }

  it('validates a correct transaction', () => {
    const result = transactionSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('coerces string amount to number', () => {
    const result = transactionSchema.safeParse({ ...validData, amount: '500' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.amount).toBe(500)
    }
  })

  it('fails when amount is 0', () => {
    const result = transactionSchema.safeParse({ ...validData, amount: 0 })
    expect(result.success).toBe(false)
  })

  it('fails when amount is negative', () => {
    const result = transactionSchema.safeParse({ ...validData, amount: -100 })
    expect(result.success).toBe(false)
  })

  it('fails when category is empty', () => {
    const result = transactionSchema.safeParse({ ...validData, category: '' })
    expect(result.success).toBe(false)
  })

  it('fails when source is empty', () => {
    const result = transactionSchema.safeParse({ ...validData, source: '' })
    expect(result.success).toBe(false)
  })

  it('fails for invalid type', () => {
    const result = transactionSchema.safeParse({
      ...validData,
      type: 'transfer',
    })
    expect(result.success).toBe(false)
  })

  it('accepts "income" type', () => {
    const result = transactionSchema.safeParse({ ...validData, type: 'income' })
    expect(result.success).toBe(true)
  })

  it('accepts optional note', () => {
    const result = transactionSchema.safeParse({ ...validData, note: 'dinner' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.note).toBe('dinner')
    }
  })

  it('passes without optional note', () => {
    const result = transactionSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})
