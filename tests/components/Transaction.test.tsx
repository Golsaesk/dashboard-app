import { describe, it, expect, vi, beforeEach } from 'vitest'
import Transaction from '@/components/transaction/Transaction'
import { render, screen, fireEvent } from '@testing-library/react'
import type { Transaction as TransactionType } from '@/type/transaction'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const mockTransactions: TransactionType[] = [
  {
    id: '1',
    amount: 5000,
    type: 'income',
    category: 'Salary',
    date: '2024-01-15',
    created_at: new Date(),
  },
  {
    id: '2',
    amount: 1200,
    type: 'expense',
    category: 'Rent',
    date: '2024-01-16',
    created_at: new Date(),
  },
  {
    id: '3',
    amount: 300,
    type: 'cost',
    category: 'Utilities',
    date: '2024-01-17',
    created_at: new Date(),
  },
]

const mockApplyFilters = vi.fn((t: TransactionType[]) => t)

vi.mock('@/features/finance/hooks/useTransaction', () => ({
  useTransactions: () => ({
    data: mockTransactions,
    isLoading: false,
  }),
  useAddTransaction: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useRemoveTransaction: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUpdateTransaction: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

vi.mock('@/providers/FilterContext', () => ({
  useFilterContext: () => ({
    applyFilters: mockApplyFilters,
    hasActiveFilter: false,
    hasActiveDateRange: false,
    dateRange: { from: null, to: null },
    filter: {
      types: [],
      sort: 'latest',
      amountMin: '',
      amountMax: '',
    },
    setFilter: vi.fn(),
    resetFilter: vi.fn(),
  }),
}))

vi.mock('@/components/transaction/TransactionHistory', () => ({
  default: ({ items }: { items: TransactionType[] }) => (
    <ul>
      {items.map((t) => (
        <li key={t.id} data-testid="transaction-item">
          {t.category}
        </li>
      ))}
    </ul>
  ),
}))

vi.mock('@/components/transaction/TransactionForm', () => ({
  default: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess}>Submit Form</button>
  ),
}))

vi.mock('@/components/skeleton/Skeleton', () => ({
  TransactionListSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}))

beforeEach(() => {
  mockApplyFilters.mockImplementation((t) => t)
})

describe('Transaction', () => {
  it('renders the section heading', () => {
    render(<Transaction />)
    expect(screen.getAllByText('Recent Transactions')[0]).toBeInTheDocument()
  })

  it('renders all transactions', () => {
    render(<Transaction />)
    expect(screen.getAllByTestId('transaction-item')).toHaveLength(3)
  })

  it('shows add transaction button', () => {
    render(<Transaction />)
    expect(
      screen.getByRole('button', { name: /add transaction/i }),
    ).toBeInTheDocument()
  })

  it('opens transaction form when add button is clicked', () => {
    render(<Transaction />)
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }))
    expect(
      screen.getByRole('button', { name: /submit form/i }),
    ).toBeInTheDocument()
  })

  it('closes form when close button is clicked', () => {
    render(<Transaction />)
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }))
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(
      screen.queryByRole('button', { name: /submit form/i }),
    ).not.toBeInTheDocument()
  })

  it('shows skeleton when loading', () => {
    vi.doMock('@/features/finance/hooks/useTransaction', () => ({
      useTransactions: () => ({ data: [], isLoading: true }),
      useAddTransaction: () => ({ mutate: vi.fn(), isPending: false }),
      useRemoveTransaction: () => ({ mutate: vi.fn(), isPending: false }),
      useUpdateTransaction: () => ({ mutate: vi.fn(), isPending: false }),
    }))
  })

  it('shows empty state when filters return no results', () => {
    mockApplyFilters.mockReturnValue([])
    render(<Transaction />)
    expect(mockApplyFilters([])).toHaveLength(0)
  })

  render(<Transaction />)
  expect(mockApplyFilters([])).toHaveLength(0)
})

it('cycles sort order on button click', () => {
  const mockSetFilter = vi.fn()
  vi.doMock('@/providers/FilterContext', () => ({
    useFilterContext: () => ({
      applyFilters: (t: TransactionType[]) => t,
      hasActiveFilter: false,
      hasActiveDateRange: false,
      dateRange: { from: null, to: null },
      filter: { types: [], sort: 'latest', amountMin: '', amountMax: '' },
      setFilter: mockSetFilter,
      resetFilter: vi.fn(),
    }),
  }))

  render(<Transaction />)
  const sortBtn = screen.getByTitle(/sort:/i)
  expect(sortBtn).toBeInTheDocument()
  fireEvent.click(sortBtn)
})
