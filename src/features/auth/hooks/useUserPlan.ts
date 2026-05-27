import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase/client'

export function useUserPlan(userId?: string) {
  return useQuery({
    queryKey: ['user-plan', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', userId)
        .single()

      if (error) throw error

      return data.plan as 'free' | 'pro'
    },
  })
}
