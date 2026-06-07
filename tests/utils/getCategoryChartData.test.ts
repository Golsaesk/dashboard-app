import { describe, it, expect } from 'vitest'
import { getCategoryChartData } from '@/helper/chart'
import { Transaction } from '@/type/transaction'

const COLORS = [
  '#0EA5E9',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
]

describe('getCategoryChartData', () => {
  it('should group transactions by category', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 100, type: 'outcome', category: 'Food' },
      { id: '2', amount: 200, type: 'outcome', category: 'Food' },
      { id: '3', amount: 500, type: 'outcome', category: 'Rent' },
    ]
    const result = getCategoryChartData(transactions)
    expect(result).toHaveLength(2)

    const food = result.find((r) => r.name === 'Food')
    expect(food?.value).toBe(300)

    const rent = result.find((r) => r.name === 'Rent')
    expect(rent?.value).toBe(500)
  })

  it('should put empty category into "Other"', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 150, type: 'outcome', category: '' },
    ]
    const result = getCategoryChartData(transactions)
    expect(result[0].name).toBe('Other')
    expect(result[0].value).toBe(150)
  })

  it('should assign colors based on index', () => {
    const transactions: Transaction[] = COLORS.map((_, i) => ({
      id: String(i),
      amount: 100,
      type: 'outcome' as const,
      category: `Cat${i}`,
    }))
    const result = getCategoryChartData(transactions)
    result.forEach((item, i) => {
      expect(item.color).toBe(COLORS[i])
    })
  })

  it('should wrap colors on overflow (modulo)', () => {
    const transactions: Transaction[] = Array.from({ length: 7 }, (_, i) => ({
      id: String(i),
      amount: 10,
      type: 'outcome' as const,
      category: `Cat${i}`,
    }))
    const result = getCategoryChartData(transactions)
    expect(result[6].color).toBe(COLORS[0])
  })

  it('should return empty array for empty input', () => {
    expect(getCategoryChartData([])).toEqual([])
  })

  it('each item should have name, value, and color', () => {
    const transactions: Transaction[] = [
      { id: '1', amount: 200, type: 'income', category: 'Salary' },
    ]
    const [item] = getCategoryChartData(transactions)
    expect(item).toHaveProperty('name')
    expect(item).toHaveProperty('value')
    expect(item).toHaveProperty('color')
  })
})
