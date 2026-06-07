import { describe, it, expect } from 'vitest'
import type { Currency } from '@/store/settingStore'

function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000')
  })

  it('formats EUR correctly', () => {
    const result = formatCurrency(1000, 'EUR')
    expect(result).toContain('1,000')
    expect(result).toContain('€')
  })

  it('formats TRY correctly', () => {
    const result = formatCurrency(1000, 'TRY')
    expect(result).toContain('1,000')
  })

  it('formats zero amount', () => {
    expect(formatCurrency(0, 'USD')).toBe('$0')
  })

  it('formats decimal amounts', () => {
    const result = formatCurrency(1000.5, 'USD')
    expect(result).toContain('1,000.5')
  })

  it('formats large numbers with comma separator', () => {
    const result = formatCurrency(1000000, 'USD')
    expect(result).toContain('1,000,000')
  })
})
