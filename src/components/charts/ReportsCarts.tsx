import { ArrowDown, ArrowUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/currency'
import { ReportItem } from '@/data/reports/reportsCarts'

type Props = {
  items: ReportItem[]
}

export default function ReportsCarts({ items }: Props) {
  return (
    <>
      {items.map((item) => {
        const isPositive = item.compared >= 0
        return (
          <div
            key={item.name}
            className="flex flex-col rounded-3xl border border-zinc-200 p-4 shadow-sm"
          >
            <p className="text-sm text-zinc-500">{item.name}</p>

            <h3 className="mt-3 text-lg font-bold text-zinc-900">
              {formatCurrency(item.total)}
            </h3>

            <div
              className={`mt-3 flex items-center gap-2 text-sm ${
                isPositive ? 'text-[#0AA165]' : 'text-red-500'
              }`}
            >
              <span>{formatCurrency(item.compared)}</span>

              {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            </div>
          </div>
        )
      })}
    </>
  )
}
