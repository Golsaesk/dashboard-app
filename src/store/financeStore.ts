import { create } from 'zustand'
import { Transaction } from '@/type/transaction'
import { demoTransactions } from '@/data/transactions/demoTransactions.config'

type FinanceStore = {
  transactions: Transaction[]

  addTransaction: (transaction: Transaction) => void

  removeTransaction: (id: string) => void

  updateTransaction: (updatedTransaction: Transaction) => void
}

export const useFinanceStore = create<FinanceStore>((set) => ({
  transactions: demoTransactions,

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction],
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter(
        (transaction) => transaction.id !== id,
      ),
    })),

  updateTransaction: (updatedTransaction) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === updatedTransaction.id
          ? updatedTransaction
          : transaction,
      ),
    })),
}))
