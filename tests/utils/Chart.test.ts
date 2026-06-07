import { describe, it, expect } from 'vitest'
import { calculateSavings } from '@/features/finance/utils/calcSavings'
import type { Transaction } from '@/type/transaction'

describe('calculateSavings', () => {
  it('adds income and subtracts outcome correctly', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 3000, type: 'income', category: 'Salary' },
      { id: '2', amount: 1000, type: 'outcome', category: 'Food' },
    ]
    expect(calculateSavings(transactions)).toBe(2000)
  })

  it('returns 0 for empty array', () => {
    expect(calculateSavings([])).toBe(0)
  })

  it('handles only income', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 5000, type: 'income', category: 'Salary' },
    ]
    expect(calculateSavings(transactions)).toBe(5000)
  })

  it('handles only outcome', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 500, type: 'outcome', category: 'Transport' },
    ]
    expect(calculateSavings(transactions)).toBe(-500)
  })

  it('handles negative savings when expenses exceed income', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 1000, type: 'income', category: 'Salary' },
      { id: '2', amount: 1500, type: 'outcome', category: 'Rent' },
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
      },
      {
        id: '2',
        amount: '500' as unknown as number,
        type: 'outcome' as const,
        category: 'Food',
      },
    ]
    expect(calculateSavings(transactions)).toBe(1500)
  })
})
