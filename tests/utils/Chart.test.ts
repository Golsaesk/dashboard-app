import { describe, it, expect } from 'vitest'
import type { Transaction } from '@/type/transaction'
import { calculateSavings } from '@/features/finance/utils/calcSavings'

describe('calculateSavings', () => {
  it('adds income and subtracts outcome correctly', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 3000, type: 'income', category: 'Salary', created_at: new Date() },
      { id: '2', amount: 1000, type: 'expense', category: 'Food', created_at: new Date()  },
    ]
    expect(calculateSavings(transactions)).toBe(2000)
  })

  it('returns 0 for empty array', () => {
    expect(calculateSavings([])).toBe(0)
  })

  it('handles only income', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 5000, type: 'income', category: 'Salary', created_at: new Date() },
    ]
    expect(calculateSavings(transactions)).toBe(5000)
  })

  it('handles only expense', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 500, type: 'expense', category: 'Transport', created_at: new Date() },
    ]
    expect(calculateSavings(transactions)).toBe(-500)
  })

  it('handles negative savings when expenses exceed income', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 1000, type: 'income', category: 'Salary', created_at: new Date() },
      { id: '2', amount: 1500, type: 'expense', category: 'Rent', created_at: new Date() },
    ]
    expect(calculateSavings(transactions)).toBe(-500)
  })

  it('coerces string amounts to numbers', () => {
    const transactions = [
      {
        id: '1',
        amount: '2000' as unknown as number,
        type: 'income' as const,
        category: 'Salary',
        created_at: new Date(),
      },
      {
        id: '2',
        amount: '500' as unknown as number,
        type: 'expense' as const,
        category: 'Food',
        created_at: new Date(),
      },
    ]
    expect(calculateSavings(transactions)).toBe(1500)
  })
})
