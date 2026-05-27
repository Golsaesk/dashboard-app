'use client'

import { useState } from 'react'
import { useFinanceStore } from '@/store/financeStore'

export default function AddFixedCost() {
  const addFixedCost = useFinanceStore((state) => state.addFixedCost),
    [title, setTitle] = useState(''),
    [amount, setAmount] = useState(''),
    [dueDay, setDueDay] = useState(1),
    handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()

      if (!title || !amount) return

      await addFixedCost({
        title,
        amount: Number(amount),
        due_day: dueDay,
      })

      setTitle('')
      setAmount('')
      setDueDay(1)
    }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl bg-zinc-900 p-6"
    >
      <h2 className="text-xl font-bold text-white">Add Fixed Cost</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="h-12 w-full rounded-xl bg-zinc-800 px-4 text-white outline-none"
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-12 w-full rounded-xl bg-zinc-800 px-4 text-white outline-none"
      />

      <input
        type="number"
        min={1}
        max={31}
        value={dueDay}
        onChange={(e) => setDueDay(Number(e.target.value))}
        className="h-12 w-full rounded-xl bg-zinc-800 px-4 text-white outline-none"
      />

      <button className="h-12 w-full rounded-xl bg-emerald-500 font-bold text-black">
        Save
      </button>
    </form>
  )
}
