import { describe, it, expect } from 'vitest'
import { calculateSavings } from '@/features/finance/utils/calcSavings'
import { Transaction } from '@/type/transaction'

describe('calculateSavings', () => {
  it('should sum incomes and subtract outcomes', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 1000, type: 'income', category: 'Salary' },
      { id: '2', amount: 400, type: 'outcome', category: 'Food' },
      { id: '3', amount: 600, type: 'income', category: 'Freelance' },
    ]
    expect(calculateSavings(transactions)).toBe(1200)
  })

  it('should return 0 for empty array', () => {
    expect(calculateSavings([])).toBe(0)
  })

  it('should be positive if only incomes exist', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 500, type: 'income', category: 'Salary' },
      { id: '2', amount: 300, type: 'income', category: 'Other' },
    ]
    expect(calculateSavings(transactions)).toBe(800)
  })

  it('should be negative if only outcomes exist', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 200, type: 'outcome', category: 'Food' },
      { id: '2', amount: 100, type: 'outcome', category: 'Transport' },
    ]
    expect(calculateSavings(transactions)).toBe(-300)
  })

  it('should work when amount is a string (coercion)', () => {
    const transactions = [
      {
        id: '1',
        amount: '2000' as any,
        type: 'income' as const,
        category: 'Salary',
      },
      {
        id: '2',
        amount: '500' as any,
        type: 'outcome' as const,
        category: 'Food',
      },
    ]
    expect(calculateSavings(transactions)).toBe(1500)
  })

  it('should ignore transactions with invalid type', () => {
    const transactions = [
      { id: '1', amount: 1000, type: 'income' as const, category: 'Salary' },
      { id: '2', amount: 999, type: 'other' as any, category: 'Unknown' },
    ]
    expect(calculateSavings(transactions)).toBe(1000)
  })
})
