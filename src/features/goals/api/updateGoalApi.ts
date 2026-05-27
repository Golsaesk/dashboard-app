import { supabase } from '@/lib/supabase/client'

export async function updateGoalSaved({
  id,
  saved,
}: {
  id: string
  saved: number
}) {
  console.log('updateGoalSaved called:', { id, saved })

  const { data, error } = await supabase
    .from('goals')
    .update({ saved_amount: saved })
    .eq('id', id)
    .select() // ← این رو اضافه کن تا ببینیم چی برمیگرده

  console.log('supabase response:', { data, error })

  if (error) throw new Error(error.message) // ← به جای throw error
}
