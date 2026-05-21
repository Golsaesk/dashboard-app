import { Transaction } from '@/type/transaction'

type Props = {
  items: Transaction[]
}

export default function TransactionHistory({ items }: Props) {
  return (
    <div className="flex w-full flex-col gap-2">
      {items.map((item) => {
        const isIncome = item.type === 'income'

        return (
          <div
            key={item.id}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-2"
          >
            {/* left side */}
            <div className="flex w-1/3 items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-300" />

              <div className="flex flex-col items-start gap-1">
                <h2 className="text-sm">{item.name}</h2>
                <div className="text-xs text-gray-500">{item.date}</div>
              </div>
            </div>

            {/* right side */}
            <div className="w-2/3 p-4 text-right">
              <div
                className={`text-lg font-medium ${
                  isIncome ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(item.amount)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
