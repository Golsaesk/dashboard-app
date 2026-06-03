import { create } from 'zustand'
import { getGoals } from '../api/goalsApi'
import { supabase } from '@/lib/supabase/client'

export type Goal = {
  id: string
  title: string
  target: number
  saved: number
}

type GoalStore = {
  goals: Goal[]
  loading: boolean
  fetchGoals: () => Promise<void>
  createGoal: (data: Partial<Goal>) => Promise<void>
  updateGoal: (id: string, data: Partial<Goal>) => Promise<void>
}

export const useGoalStore = create<GoalStore>((set, get) => ({
  goals: [],
  loading: false,

  fetchGoals: async () => {
    set({ loading: true })

    try {
      const data = await getGoals()

      const mapped: Goal[] = data.map((g) => ({
        id: g.id,
        title: g.title,
        target: g.target_amount,
        saved: g.saved_amount,
      }))

      set({ goals: mapped })
    } catch (error) {
      console.error('fetchGoals error:', error)
    } finally {
      set({ loading: false })
    }
  },

  createGoal: async (data) => {
    const { error } = await supabase.from('goals').insert([
      {
        title: data.title,
        target_amount: data.target,
        saved_amount: data.saved ?? 0,
      },
    ])

    if (error) throw error

    await get().fetchGoals()
  },

  updateGoal: async (id, data) => {
    const updateData: {
      title?: string
      target_amount?: number
      saved_amount?: number
    } = {}

    if (data.title !== undefined) {
      updateData.title = data.title
    }

    if (data.target !== undefined) {
      updateData.target_amount = data.target
    }

    if (data.saved !== undefined) {
      updateData.saved_amount = data.saved
    }

    const { error } = await supabase
      .from('goals')
      .update(updateData)
      .eq('id', id)

    if (error) throw error

    await get().fetchGoals()
  },
}))
