import { ArrowDown, ArrowUp } from 'lucide-react'
import { SummaryCartsItem } from '@/type/summaryCart'

type Props = {
  items: SummaryCartsItem[]
}

export default function SummaryCards({ items }: Props) {
  return (
    <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item) => {
        const compared = item.compared ?? 0
        const isPositive = compared >= 0

        return (
          <div
            key={item.name}
            className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
          >
            <div className="flex items-center gap-2">
              {item.icon && (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <item.icon className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                </div>
              )}
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {item.name}
              </p>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-white">
              {item.value
                ? item.value
                : new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  }).format(item.total || 0)}
            </h3>

            <div
              className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-red-500 dark:text-red-400'
              }`}
            >
              {isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(Math.abs(compared))}
              </span>
              <span className="font-normal text-zinc-400 dark:text-zinc-500">
                vs last month
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
