import { ArrowDown, ArrowUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'
import { SummaryCartsItem } from '@/type/summaryCart'

type Props = {
  items: SummaryCartsItem[]
}

export default function SummaryCards({ items }: Props) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const hasCompared = item.compared !== undefined
        const compared = item.compared ?? 0
        const isPositive = compared >= 0

        return (
          <div
            key={item.name}
            className="card-shadow bg-card hover:card-shadow-md flex flex-col rounded-3xl p-5 transition"
          >
            <div className="flex items-center gap-2.5">
              {item.icon && (
                <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-xl">
                  <item.icon className="h-4 w-4" />
                </div>
              )}
              <p className="text-foreground text-sm font-medium">{item.name}</p>
            </div>

            <h3 className="text-foreground mt-4 text-2xl font-semibold tracking-tight">
              {item.value
                ? item.value
                : formatCurrency(Number(item.total) || 0)}
            </h3>

            {hasCompared && (
              <div
                className={`mt-2 flex items-center gap-1 text-xs font-medium ${
                  isPositive ? 'text-primary' : 'text-red-500'
                }`}
              >
                {isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span>{formatCurrency(Math.abs(compared))}</span>
                <span className="text-muted-foreground font-normal">
                  vs last month
                </span>
              </div>
            )}

            {!hasCompared && (
              <p className="text-muted-foreground mt-2 text-xs">
                from last month
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
