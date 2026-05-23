import { Transaction } from '@/type/transaction'

type Props = {
  items: Transaction[]
}

export default function TransactionHistory({ items }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const isIncome = item.type === 'income'

        return (
          <div
            key={item.id}
            className="group relative flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-200 transition-transform duration-300 group-hover:scale-110" />

              <div>
                <p className="text-sm font-medium text-zinc-900">{item.name}</p>
                <p className="text-xs text-zinc-500">{item.date}</p>
              </div>
            </div>
            <p
              className={`text-sm font-semibold transition-transform duration-300 group-hover:scale-105 ${isIncome ? 'text-[#0AA165]' : 'text-red-500'} `}
            >
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(item.amount)}
            </p>
          </div>
        )
      })}
    </div>
  )
}
