'use client'

import { useRef } from 'react'
import GoalChart from '@/components/charts/GoalChart'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export type GoalProgress = {
  id: string
  title: string
  target_amount: number
  saved_amount: number
  saved: number
  percent: number
}

type Props = {
  goals?: GoalProgress[]
  isLoading?: boolean
}

export default function GoalCarousel({ goals = [], isLoading }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return
    const width = containerRef.current.offsetWidth
    containerRef.current.scrollBy({
      left: direction === 'right' ? width : -width,
      behavior: 'smooth',
    })
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        Loading goals...
      </div>
    )
  }

  if (!goals.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <GoalChart />
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        aria-label="Scroll left"
        className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow dark:bg-zinc-800"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => scroll('right')}
        aria-label="Scroll right"
        className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-white/80 p-1 shadow dark:bg-zinc-800"
      >
        <ChevronRight />
      </button>

      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth"
      >
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="min-w-full snap-center rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <GoalChart goal={goal} />
          </div>
        ))}
      </div>
    </div>
  )
}
