import { describe, it, expect } from 'vitest'
import { Transaction } from '@/type/transaction'
import { calculateSavings } from '@/features/finance/utils/calcSavings'

describe('calculateSavings', () => {
  it('should sum incomes and subtract outcomes', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 1000,
        type: 'income',
        category: 'Salary',
        created_at: new Date(),
      },
      {
        id: '2',
        amount: 400,
        type: 'expense',
        category: 'Food',
        created_at: new Date(),
      },
      {
        id: '3',
        amount: 600,
        type: 'income',
        category: 'Freelance',
        created_at: new Date(),
      },
    ]
    expect(calculateSavings(transactions)).toBe(1200)
  })

  it('should return 0 for empty array', () => {
    expect(calculateSavings([])).toBe(0)
  })

  it('should be positive if only incomes exist', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 500,
        type: 'income',
        category: 'Salary',
        created_at: new Date(),
      },
      {
        id: '2',
        amount: 300,
        type: 'income',
        category: 'Other',
        created_at: new Date(),
      },
    ]
    expect(calculateSavings(transactions)).toBe(800)
  })

  it('should be negative if only outcomes exist', () => {
    const transactions: Transaction[] = [
      {
        id: '1',
        amount: 200,
        type: 'expense',
        category: 'Food',
        created_at: new Date(),
      },
      {
        id: '2',
        amount: 100,
        type: 'expense',
        category: 'Transport',
        created_at: new Date(),
      },
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
        created_at: new Date(),
      },
      {
        id: '2',
        amount: '500' as any,
        type: 'expense' as const,
        category: 'Food',
        created_at: new Date(),
      },
    ]
    expect(calculateSavings(transactions)).toBe(1500)
  })

  it('should ignore transactions with invalid type', () => {
    const transactions = [
      {
        id: '1',
        amount: 1000,
        type: 'income' as const,
        category: 'Salary',
        created_at: new Date(),
      },
      {
        id: '2',
        amount: 999,
        type: 'other' as any,
        category: 'Unknown',
        created_at: new Date(),
      },
    ]
    expect(calculateSavings(transactions)).toBe(1000)
  })
})
