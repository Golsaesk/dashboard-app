'use client'

import { CalendarDays } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'
import { useFixedCosts } from '@/features/fixedCosts/hooks/useFixedCosts'

export default function UpcomingFixedCosts() {
  const { data: fixedCosts = [], isLoading } = useFixedCosts(),
    today = new Date().getDate(),
    upcomingCosts = [...fixedCosts]
      .sort((a, b) => {
        const daysA =
          a.due_day >= today ? a.due_day - today : 31 - today + a.due_day

        const daysB =
          b.due_day >= today ? b.due_day - today : 31 - today + b.due_day

        return daysA - daysB
      })
      .slice(0, 5)

  return (
    <div className="card-shadow bg-card rounded-3xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays size={18} />
        <h3 className="text-foreground text-sm font-semibold">
          Upcoming Fixed Costs
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-muted h-12 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : upcomingCosts.length === 0 ? (
        <p className="text-muted-foreground text-sm">No fixed costs found.</p>
      ) : (
        <div className="space-y-3">
          {upcomingCosts.map((cost) => {
            const daysLeft =
              cost.due_day >= today
                ? cost.due_day - today
                : 31 - today + cost.due_day

            return (
              <div
                key={cost.id}
                className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {cost.title}
                  </p>

                  <p className="text-muted-foreground text-xs">
                    Due on day {cost.due_day}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">
                    {formatCurrency(cost.amount)}
                  </p>

                  <p className="text-xs text-amber-500">
                    {daysLeft === 0
                      ? 'Due today'
                      : `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
