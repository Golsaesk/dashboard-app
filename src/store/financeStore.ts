import { create } from 'zustand'

export type FixedCost = {
  id: string
  title: string
  amount: number
  due_day: number
}

type FinanceState = {
  fixedCosts: FixedCost[]

  fetchFixedCosts: () => Promise<void>
  addFixedCost: (data: Omit<FixedCost, 'id'>) => Promise<void>
  removeFixedCost: (id: string) => Promise<void>
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  fixedCosts: [],

  fetchFixedCosts: async () => {
    const res = await fetch('/api/fixed-costs')
    const data = await res.json()
    set({ fixedCosts: data })
  },

  addFixedCost: async (data) => {
    const res = await fetch('/api/fixed-costs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const newItem = await res.json()
    set({ fixedCosts: [...get().fixedCosts, newItem] })
  },

  removeFixedCost: async (id) => {
    await fetch(`/api/fixed-costs/${id}`, {
      method: 'DELETE',
    })

    set({
      fixedCosts: get().fixedCosts.filter((c) => c.id !== id),
    })
  },
}))
