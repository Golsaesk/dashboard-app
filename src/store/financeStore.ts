import { create } from 'zustand'

export type FixedCost = {
  id: string
  title: string
  amount: number
  due_day: number
}

type FinanceState = {
  fixedCosts: FixedCost[]
  loading: boolean
  error: string | null

  fetchFixedCosts: () => Promise<void>
  addFixedCost: (data: Omit<FixedCost, 'id'>) => Promise<void>
  removeFixedCost: (id: string) => Promise<void>
  clearError: () => void
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  fixedCosts: [],
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchFixedCosts: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/fixed-costs')
      if (!res.ok) {
        throw new Error(
          `Failed to fetch fixed costs: ${res.status} ${res.statusText}`,
        )
      }
      const data: FixedCost[] = await res.json()
      set({ fixedCosts: data })
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unknown error fetching fixed costs'
      set({ error: message })
      console.error('[financeStore] fetchFixedCosts:', message)
    } finally {
      set({ loading: false })
    }
  },

  addFixedCost: async (data) => {
    set({ error: null })
    try {
      const res = await fetch('/api/fixed-costs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        throw new Error(
          `Failed to add fixed cost: ${res.status} ${res.statusText}`,
        )
      }
      const newItem: FixedCost = await res.json()
      set({ fixedCosts: [newItem, ...get().fixedCosts] })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error adding fixed cost'
      set({ error: message })
      console.error('[financeStore] addFixedCost:', message)
      throw err
    }
  },

  removeFixedCost: async (id) => {
    const previous = get().fixedCosts
    // optimistic update
    set({ fixedCosts: previous.filter((c) => c.id !== id), error: null })
    try {
      const res = await fetch(`/api/fixed-costs/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error(
          `Failed to remove fixed cost: ${res.status} ${res.statusText}`,
        )
      }
    } catch (err) {
      // rollback on failure
      set({ fixedCosts: previous })
      const message =
        err instanceof Error ? err.message : 'Unknown error removing fixed cost'
      set({ error: message })
      console.error('[financeStore] removeFixedCost:', message)
      throw err
    }
  },
}))
