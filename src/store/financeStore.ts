import { create } from 'zustand'
import { Transaction } from '@/type/transaction'

type FinanceStore = {
  transactions: Transaction[]

  addTransaction: (transaction: Transaction) => void
  removeTransaction: (id: string) => void
  updateTransaction: (updatedTransaction: Transaction) => void
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  transactions: [
    {
      id: '1',
      name: 'Salary',
      amount: 5000,
      date: '2026-01-01',
      type: 'income',
    },
  ],

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  updateTransaction: (updated) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === updated.id ? updated : t,
      ),
    })),
}))
