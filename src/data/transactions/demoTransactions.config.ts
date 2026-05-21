import { Transaction } from './transaction'

export const demoTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Salary',
    amount: 5000,
    type: 'income',
    date: '2026-05-01',
  },

  {
    id: '2',
    title: 'Groceries',
    amount: 300,
    type: 'outcome',
    date: '2026-05-02',
  },

  {
    id: '3',
    title: 'Freelance Project',
    amount: 1200,
    type: 'income',
    date: '2026-05-05',
  },
]
