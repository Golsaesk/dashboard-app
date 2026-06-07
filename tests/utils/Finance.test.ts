import { describe, it, expect } from 'vitest'
import {
  getTotalIncome,
  getTotalOutcome,
  getBalance,
  getTopSource,
  getMonthlyAverage,
  getMostSpend,
  getNetSaving,
} from '@/helper/finance'
import type { Transaction } from '@/type/transaction'

const mockTransactions: Transaction[] = [
  { id: '1', amount: 5000, type: 'income', category: 'Salary', created_at: new Date() },
  { id: '2', amount: 2000, type: 'income', category: 'Freelance', created_at: new Date() },
  { id: '3', amount: 1000, type: 'expense', category: 'Food', created_at: new Date() },
  { id: '4', amount: 500, type: 'expense', category: 'Food', created_at: new Date() },
  { id: '5', amount: 800, type: 'expense', category: 'Transport', created_at: new Date() },
]

describe('finance helpers', () => {
  describe('getTotalIncome', () => {
    it('sums all income transactions', () => {
      expect(getTotalIncome(mockTransactions)).toBe(7000)
    })

    it('returns 0 for empty array', () => {
      expect(getTotalIncome([])).toBe(0)
    })

    it('returns 0 when no income transactions', () => {
      const expenses = mockTransactions.filter((t) => t.type === 'expense')
      expect(getTotalIncome(expenses)).toBe(0)
    })
  })

  describe('getTotalOutcome', () => {
    it('sums all expenses transactions', () => {
      expect(getTotalOutcome(mockTransactions)).toBe(2300)
    })

    it('returns 0 for empty array', () => {
      expect(getTotalOutcome([])).toBe(0)
    })
  })

  describe('getBalance', () => {
    it('returns income minus outcome', () => {
      expect(getBalance(mockTransactions)).toBe(4700)
    })

    it('returns 0 for empty array', () => {
      expect(getBalance([])).toBe(0)
    })
  })

  describe('getTopSource', () => {
    it('returns the category with highest income', () => {
      expect(getTopSource(mockTransactions)).toBe('Salary')
    })

    it('returns "No Source" for empty array', () => {
      expect(getTopSource([])).toBe('No Source')
    })

    it('returns "No Source" when no income transactions', () => {
      const outcomes = mockTransactions.filter((t) => t.type === 'expense')
      expect(getTopSource(outcomes)).toBe('No Source')
    })
  })

  describe('getMonthlyAverage', () => {
    it('calculates average amount across all transactions', () => {
      const total = 5000 + 2000 + 1000 + 500 + 800
      const avg = total / 5
      expect(getMonthlyAverage(mockTransactions)).toBeCloseTo(avg)
    })

    it('returns 0 for empty array', () => {
      expect(getMonthlyAverage([])).toBe(0)
    })
  })

  describe('getMostSpend', () => {
    it('returns the outcome category with highest total', () => {
      expect(getMostSpend(mockTransactions)).toBe('Food')
    })

    it('returns "No Spending" when no outcome transactions', () => {
      const incomes = mockTransactions.filter((t) => t.type === 'income')
      expect(getMostSpend(incomes)).toBe('No Spending')
    })

    it('returns "No Spending" for empty array', () => {
      expect(getMostSpend([])).toBe('No Spending')
    })
  })

  describe('getNetSaving', () => {
    it('returns income minus outcome', () => {
      expect(getNetSaving(mockTransactions)).toBe(4700)
    })

    it('returns 0 for empty array', () => {
      expect(getNetSaving([])).toBe(0)
    })
  })
})
