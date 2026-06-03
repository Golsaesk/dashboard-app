import { create } from 'zustand'

type FixedCost = {
  id: string
  name: string
  amount: number
}

type FixedCostStore = {
  fixedCosts: FixedCost[]
  loading: boolean
  fetchFixedCosts: () => Promise<void>
}

export const useFixedCostsStore = create<FixedCostStore>((set) => ({
  fixedCosts: [],
  loading: false,

  fetchFixedCosts: async () => {
    set({ loading: true })
    try {
      const res = await fetch('/api/fixed-costs')
      const data = await res.json()
      set({ fixedCosts: data })
    } catch (e) {
      console.error('fetchFixedCosts error:', e)
    } finally {
      set({ loading: false })
    }
  },
}))
