import { TransactionType } from '@/data/transactions/transactionhistory'

type props = {
  items: TransactionType[]
}

export default function IncomeHistory({ items }: props) {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-2">
      {items.map((item) => {
        return (
          <div
            key={item.id}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-2"
          >
            <div className="flex w-1/3 items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-500"></div>
              <div className="flex flex-col items-start gap-1">
                <div>
                  <h2 className="text-sm">{item.name}</h2>
                </div>
                <div>{item.date}</div>
              </div>
            </div>
            <div className="w-2/3 gap-4 p-4 text-right">
              <div className="text-lg text-red-500">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(3456.56)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
