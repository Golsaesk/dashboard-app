'use client'
import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'
import TransactionForm from './TransactionForm'
import TransactionHistory from './TransactionHistory'
import { transactionItems } from '@/data/transactionhistory.config'

export default function Transaction() {
  const [transactions, setTransactions] = useState(false)

  const handleClick = () => {
    setTransactions(!transactions)
  }
  return (
    <div
      id="transactions"
      className="flex flex-col items-center gap-4 bg-gray-100 p-6 text-gray-800"
    >
      <div id="top" className="flex w-full items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Latest Spending</h2>
        </div>
        <div>
          <ArrowUpDown />
        </div>
      </div>
      <div
        id="body"
        className="flex w-full flex-col items-center justify-between gap-2"
      >
        <TransactionHistory items={transactionItems} />
      </div>
      {transactions && (
        <>
          <div className="h-60 w-full bg-red-200">
            <TransactionForm />
          </div>
        </>
      )}
      <button
        className="hover:bg-green flex w-full items-center justify-center rounded-3xl bg-gray-300 p-4 transition-all duration-500 hover:text-lg"
        onClick={handleClick}
      >
        ADD TRANSACTIONS
      </button>
    </div>
  )
}
