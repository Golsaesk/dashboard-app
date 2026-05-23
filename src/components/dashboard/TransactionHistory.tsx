import { TransactionType } from '@/data/transactions/transactionHistoryType'

type Props = {
  items?: TransactionType[]
}

const mockItems: TransactionType[] = [
  {
    id: 'mock-1',
    name: 'Coffee',
    date: '2026-01-01',
    amount: 12,
    type: 'expense',
  },
  {
    id: 'mock-2',
    name: 'Salary',
    date: '2026-01-02',
    amount: 5000,
    type: 'income',
  },
]

export default function TransactionHistory({ items }: Props) {
  const data = items && items.length > 0 ? items : mockItems

  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => {
        const isIncome = item.type === 'income'

        return (
          <div
            key={item.id}
            className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white p-3 transition-all duration-300 ease-out hover:scale-[1.02] hover:border-zinc-300 hover:shadow-lg"
          >
            <div className="flex w-1/3 items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-zinc-300" />

              <div className="flex flex-col items-start gap-1">
                <h2 className="text-sm font-medium text-zinc-900">
                  {item.name}
                </h2>
                <div className="text-xs text-zinc-500">{item.date}</div>
              </div>
            </div>
            <div className="w-2/3 text-right">
              <div
                className={`text-base font-semibold transition-colors ${
                  isIncome ? 'text-[#0AA165]' : 'text-red-500'
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
