import { ArrowDown, ArrowUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'
import { SummaryCartsItem } from '@/type/summaryCart'

type Props = {
  items: SummaryCartsItem[]
}

export default function SummaryCards({ items }: Props) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const hasCompared = item.compared !== undefined
        const compared = item.compared ?? 0

        const isPositive = compared >= 0

        return (
          <div
            key={item.name}
            className="card-shadow bg-card rounded-3xl p-6 transition-all duration-200 hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              {item.icon && (
                <div className="bg-primary text-primary-foreground flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl">
                  <item.icon className="h-5 w-5" />
                </div>
              )}

              <p className="text-foreground text-sm font-medium">{item.name}</p>
            </div>

            <h3 className="text-foreground mt-5 text-3xl font-bold tracking-tight">
              {item.value
                ? item.value
                : formatCurrency(Number(item.total) || 0)}
            </h3>

            {hasCompared ? (
              <div
                className={`mt-3 flex items-center gap-1.5 text-xs font-medium ${isPositive ? 'text-primary' : 'text-red-500'} `}
              >
                {isPositive ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5" />
                )}

                <span>{formatCurrency(Math.abs(compared))}</span>

                <span className="text-muted-foreground font-normal">
                  vs last month
                </span>
              </div>
            ) : (
              <p className="text-muted-foreground mt-3 text-xs">
                from last month
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
