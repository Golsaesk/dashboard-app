'use client'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import ProfileOverview from '@/components/profile/ProfileOverview'
import { useGoalsProgress } from '@/features/goals/hooks/useGoalsProgress'
import AddGoalForm from '@/features/goals/components/AddGoalForm'
import Profile from '@/components/profile/Profile'

export default function ProfilePage() {
  // const { data } = useGoalsProgress()

  // const [open, setOpen] = useState(false)

  // if (!data) return null
  // return (
  //   <div className="flex flex-col gap-4 p-6">
  //     <ProfileOverview />
  //     <div className="space-y-8">
  //       {/* HEADER */}
  //       <div className="flex items-center justify-between">
  //         <h1 className="text-2xl font-bold">Your Goals</h1>

  //         <button
  //           onClick={() => setOpen(true)}
  //           className="rounded-xl bg-green-600 px-5 py-3 text-white transition hover:bg-green-700"
  //         >
  //           Add Goal
  //         </button>
  //       </div>

  //       {/* FORM */}
  //       <AnimatePresence>{open && <AddGoalForm />}</AnimatePresence>

  //       {/* GOALS LIST */}
  //       <div className="space-y-4">
  //         {data?.map((goal) => (
  //           <div key={goal.id} className="rounded-xl border p-4">
  //             <h3 className="font-semibold">{goal.title}</h3>

  //             <p className="text-zinc-500">Target: ${goal.target_amount}</p>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // )
  return(
    <div>
      <Profile />
    </div>
  )
}
