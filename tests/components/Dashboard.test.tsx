import { describe, it, expect, vi } from 'vitest'
import type { Transaction } from '@/type/transaction'
import { render, screen } from '@testing-library/react'
import Dashboard from '@/components/dashboard/Dashboard'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 3000,
    type: 'income',
    category: 'Salary',
    date: '2024-01-01',
    created_at: new Date(),
  },
  {
    id: '2',
    amount: 800,
    type: 'expense',
    category: 'Food',
    date: '2024-01-02',
    created_at: new Date(),
  },
]

vi.mock('@/features/finance/hooks/useTransaction', () => ({
  useTransactions: () => ({ data: mockTransactions, isLoading: false }),
  useAddTransaction: () => ({ mutate: vi.fn(), isPending: false }),
  useRemoveTransaction: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateTransaction: () => ({ mutate: vi.fn(), isPending: false }),
}))

vi.mock('@/providers/FilterContext', () => ({
  useFilterContext: () => ({
    applyFilters: (t: Transaction[]) => t,
    hasActiveFilter: false,
    hasActiveDateRange: false,
    dateRange: { from: null, to: null },
    filter: { types: [], sort: 'latest', amountMin: '', amountMax: '' },
    setFilter: vi.fn(),
    resetFilter: vi.fn(),
  }),
}))

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector: (s: { plan: string }) => unknown) =>
    selector({ plan: 'free' }),
}))

vi.mock('@/components/dashboard/AiHighlight', () => ({
  default: () => <div data-testid="ai-highlight">AI Highlight</div>,
}))

vi.mock('@/components/dashboard/AiFinanceStatusCard', () => ({
  default: () => <div data-testid="ai-finance-card">AI Finance Card</div>,
}))

vi.mock('@/components/dashboard/DailyReportButton', () => ({
  default: () => <button>Send Daily Report</button>,
}))

vi.mock('@/components/charts/Chart', () => ({
  default: () => <div data-testid="chart">Chart</div>,
}))

vi.mock('@/components/charts/GoalChart', () => ({
  default: () => <div data-testid="goal-chart">Goal Chart</div>,
}))

vi.mock('@/components/summaryCarts/SummaryCarts', () => ({
  default: () => <div data-testid="summary-cards">Summary Cards</div>,
}))

vi.mock('@/components/transaction/Transaction', () => ({
  default: () => <div data-testid="transaction">Transaction</div>,
}))

vi.mock('@/components/outcome/UpcomingFixedCosts', () => ({
  default: () => (
    <div data-testid="upcoming-fixed-costs">Upcoming Fixed Costs</div>
  ),
}))

vi.mock('@/components/navbar/Activefilterbadge', () => ({
  default: () => <div data-testid="filter-badge">Active Filter</div>,
}))

vi.mock('@/components/skeleton/Skeleton', () => ({
  CardsGridSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}))

vi.mock('@/config/dashboardSummary', () => ({
  getDashboardSummary: () => [
    { name: 'Total Income', total: 3000 },
    { name: 'Total Outcome', total: 800 },
  ],
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

describe('Dashboard', () => {
  it('renders without crashing', () => {
    render(<Dashboard />)
    expect(screen.getByTestId('ai-highlight')).toBeInTheDocument()
  })

  it('renders chart section', () => {
    render(<Dashboard />)
    expect(screen.getByTestId('chart')).toBeInTheDocument()
    expect(screen.getByTestId('goal-chart')).toBeInTheDocument()
  })

  it('renders summary cards', () => {
    render(<Dashboard />)
    expect(screen.getByTestId('summary-cards')).toBeInTheDocument()
  })

  it('renders transaction section', () => {
    render(<Dashboard />)
    expect(screen.getByTestId('transaction')).toBeInTheDocument()
  })

  it('renders cashflow heading', () => {
    render(<Dashboard />)
    expect(screen.getByText('Cashflow')).toBeInTheDocument()
  })

  it('renders savings goal heading', () => {
    render(<Dashboard />)
    expect(screen.getByText('Savings Goal')).toBeInTheDocument()
  })

  it('renders total balance label', () => {
    render(<Dashboard />)
    expect(screen.getByText('Total Balance')).toBeInTheDocument()
  })

  it('renders quick summary section', () => {
    render(<Dashboard />)
    expect(screen.getByText('Quick Summary')).toBeInTheDocument()
  })

  it('does not render filter badge when no filter is active', () => {
    render(<Dashboard />)
    expect(screen.queryByTestId('filter-badge')).not.toBeInTheDocument()
  })

  it('renders upcoming fixed costs', () => {
    render(<Dashboard />)
    expect(screen.getByTestId('upcoming-fixed-costs')).toBeInTheDocument()
  })
})
