import { FeatureGate } from '@/components/auth/FeatureGate'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

let mockPlan = 'free'

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector: (s: { plan: string }) => unknown) =>
    selector({ plan: mockPlan }),
}))

beforeEach(() => {
  mockPlan = 'free'
  mockPush.mockClear()
})

describe('FeatureGate', () => {
  it('renders children when plan is pro', () => {
    mockPlan = 'pro'
    render(
      <FeatureGate>
        <div>Pro content</div>
      </FeatureGate>,
    )
    expect(screen.getByText('Pro content')).toBeInTheDocument()
  })

  it('renders fallback when provided and plan is free', () => {
    render(
      <FeatureGate fallback={<div>Custom fallback</div>}>
        <div>Pro content</div>
      </FeatureGate>,
    )
    expect(screen.getByText('Custom fallback')).toBeInTheDocument()
    expect(screen.queryByText('Pro content')).not.toBeInTheDocument()
  })

  it('renders page variant upgrade prompt for free plan', () => {
    render(
      <FeatureGate variant="page" title="AI Reports">
        <div>Pro content</div>
      </FeatureGate>,
    )
    expect(screen.getByText('AI Reports')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /upgrade to pro/i }),
    ).toBeInTheDocument()
    expect(screen.queryByText('Pro content')).not.toBeInTheDocument()
  })

  it('page variant upgrade link points to /pricing', () => {
    render(
      <FeatureGate variant="page">
        <div>Pro content</div>
      </FeatureGate>,
    )
    const link = screen.getByRole('link', { name: /upgrade to pro/i })
    expect(link).toHaveAttribute('href', '/pricing')
  })

  it('renders overlay variant for free plan', () => {
    render(
      <FeatureGate variant="overlay" title="Premium Feature">
        <div>Pro content</div>
      </FeatureGate>,
    )
    expect(screen.getByText('Premium Feature')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /upgrade to pro/i }),
    ).toBeInTheDocument()
  })

  it('overlay upgrade button navigates to /pricing', () => {
    render(
      <FeatureGate variant="overlay">
        <div>Pro content</div>
      </FeatureGate>,
    )
    fireEvent.click(screen.getByRole('button', { name: /upgrade to pro/i }))
    expect(mockPush).toHaveBeenCalledWith('/pricing')
  })

  it('uses default title when none provided', () => {
    render(
      <FeatureGate variant="page">
        <div>Pro content</div>
      </FeatureGate>,
    )
    expect(screen.getByText('Pro Feature')).toBeInTheDocument()
  })

  it('uses custom description when provided', () => {
    render(
      <FeatureGate variant="page" description="Subscribe to unlock.">
        <div>Pro content</div>
      </FeatureGate>,
    )
    expect(screen.getByText('Subscribe to unlock.')).toBeInTheDocument()
  })
})
