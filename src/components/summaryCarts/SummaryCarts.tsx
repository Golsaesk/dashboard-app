import { SummaryCartsItem } from '@/data/summarycart/summaryCart'
import { ArrowDown, ArrowUp } from 'lucide-react'

type Props = {
  items: SummaryCartsItem[]
}
export default function SummaryCards({ items }: Props) {
  return (
    <div className="grid w-full grid-cols-2 gap-4">
      {items.map((item) => {
        const compared = item.compared ?? 0
        const isPositive = compared >= 0

        return (
          <div
            key={item.name}
            className="flex flex-col rounded-3xl border border-zinc-200 p-4 shadow-sm"
          >
            <div className="flex items-center gap-2">
              {item.icon && <item.icon className="h-6 w-6 text-zinc-500" />}
              <p className="text-sm text-zinc-500">{item.name}</p>
            </div>

            <h3 className="mt-3 text-lg font-bold text-zinc-900">
              {item.value
                ? item.value
                : new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(item.total || 0)}
            </h3>

            <div
              className={`mt-3 flex items-center gap-2 text-sm ${
                isPositive ? 'text-[#0AA165]' : 'text-red-500'
              }`}
            >
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <ArrowUp className="size-4 text-green-500" />
                ) : (
                  <ArrowDown className="size-4 text-red-500" />
                )}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(compared)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
