// components/skeleton/Skeleton.tsx
// ─── Base pulse animation ────────────────────────────────────────────────────
function Pulse({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800 ${className}`}
    />
  )
}

// ─── Card Skeleton — برای SummaryCards ──────────────────────────────────────
export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <Pulse className="h-8 w-8 rounded-lg" />
        <Pulse className="h-3.5 w-20" />
      </div>
      <Pulse className="h-6 w-28" />
      <Pulse className="h-3 w-16" />
    </div>
  )
}

// ─── Cards Grid Skeleton — برای کل grid از کارت‌ها ──────────────────────────
export function CardsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Chart Skeleton — برای Line/Area chart‌ها ────────────────────────────────
export function ChartSkeleton() {
  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
        {[60, 72, 56].map((w, i) => (
          <Pulse key={i} className={`h-8 w-${w} flex-1`} />
        ))}
      </div>
      {/* Chart area */}
      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
        <div className="absolute inset-0 animate-pulse" />
        {/* Fake bars to simulate chart */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around gap-2 px-4 pb-4">
          {[60, 80, 45, 90, 55, 70, 40, 85, 65, 75, 50, 95].map((h, i) => (
            <div
              key={i}
              className="w-full rounded-t-md bg-zinc-200 dark:bg-zinc-700"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Pie Chart Skeleton — برای CategoryChart و GoalChart ────────────────────
export function PieChartSkeleton() {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-center">
      <div className="mx-auto h-52 w-52 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-800 md:mx-0" />
      <div className="flex-1 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-2 py-2">
            <div className="flex items-center gap-3">
              <Pulse className="h-2.5 w-2.5 rounded-full" />
              <Pulse className="h-3.5 w-24" />
            </div>
            <div className="flex gap-4">
              <Pulse className="h-3.5 w-8" />
              <Pulse className="h-3.5 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Row Skeleton — برای TransactionHistory ──────────────────────────────────
export function RowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-100 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <Pulse className="h-9 w-9 rounded-full" />
        <div className="space-y-1.5">
          <Pulse className="h-3.5 w-28" />
          <Pulse className="h-3 w-16" />
        </div>
      </div>
      <Pulse className="h-4 w-16" />
    </div>
  )
}

// ─── Transaction List Skeleton ───────────────────────────────────────────────
export function TransactionListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <RowSkeleton key={i} />
      ))}
    </div>
  )
}

// ─── Goal Skeleton ───────────────────────────────────────────────────────────
export function GoalSkeleton() {
  return (
    <div className="flex items-center gap-6">
      <Pulse className="h-36 w-36 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="space-y-1.5">
          <Pulse className="h-4 w-32" />
          <Pulse className="h-3 w-20" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Pulse className="h-3 w-12" />
              <Pulse className="h-4 w-16" />
            </div>
          ))}
        </div>
        <Pulse className="h-1.5 w-full" />
      </div>
    </div>
  )
}

// ─── Full Page Skeletons — آماده برای هر صفحه ───────────────────────────────
export function DashboardSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Pulse className="h-6 w-28" />
            <Pulse className="h-4 w-40" />
          </div>
          <Pulse className="h-10 w-36 rounded-xl" />
        </div>
        <CardsGridSkeleton />
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Pulse className="mb-5 h-5 w-24" />
          <ChartSkeleton />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Pulse className="mb-5 h-5 w-40" />
          <TransactionListSkeleton />
        </div>
      </div>
    </main>
  )
}

export function IncomeSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <CardsGridSkeleton count={2} />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <GoalSkeleton />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <PieChartSkeleton />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <TransactionListSkeleton />
        </div>
      </div>
    </main>
  )
}

export function OutcomeSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <CardsGridSkeleton count={2} />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <PieChartSkeleton />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <TransactionListSkeleton />
        </div>
      </div>
    </main>
  )
}

export function ReportSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Pulse className="h-7 w-40" />
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <CardsGridSkeleton count={4} />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <PieChartSkeleton />
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <ChartSkeleton />
        </div>
      </div>
    </main>
  )
}

// ─── Profile Skeleton ─────────────────────────────────────────────────────────
export function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {/* Profile Info */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Pulse className="mb-4 h-5 w-20" />
          <div className="flex items-center gap-4">
            <Pulse className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Pulse className="h-4 w-32" />
              <Pulse className="h-3.5 w-48" />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Pulse className="mb-4 h-5 w-40" />
          <CardsGridSkeleton count={4} />
        </div>

        {/* Goals */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex items-center justify-between">
            <Pulse className="h-5 w-16" />
            <Pulse className="h-8 w-24 rounded-xl" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="mb-2 flex items-center justify-between">
                  <Pulse className="h-4 w-28" />
                  <Pulse className="h-6 w-20 rounded-lg" />
                </div>
                <Pulse className="mb-2 h-1.5 w-full rounded-full" />
                <div className="flex justify-between">
                  <Pulse className="h-3 w-20" />
                  <Pulse className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

// ─── Pricing Skeleton ─────────────────────────────────────────────────────────
export function PricingSkeleton() {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mx-auto mb-14 flex max-w-xl flex-col items-center gap-3">
          <Pulse className="h-7 w-24 rounded-full" />
          <Pulse className="h-9 w-64" />
          <Pulse className="h-4 w-80" />
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <Pulse className="mb-2 h-5 w-16" />
              <Pulse className="mb-4 h-10 w-24" />
              <Pulse className="mb-6 h-4 w-40" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Pulse className="h-5 w-5 rounded-full" />
                    <Pulse className="h-3.5 w-32" />
                  </div>
                ))}
              </div>
              <Pulse className="mt-8 h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

// ─── Setting Skeleton ─────────────────────────────────────────────────────────
export function SettingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 p-6 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <Pulse className="mb-8 h-7 w-28" />
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <Pulse className="h-4 w-24" />
              <div className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                {[1].map((j) => (
                  <div key={j} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Pulse className="h-9 w-9 rounded-xl" />
                      <div className="space-y-1.5">
                        <Pulse className="h-4 w-24" />
                        <Pulse className="h-3 w-36" />
                      </div>
                    </div>
                    <Pulse className="h-7 w-12 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}