type Props = {
  items: SummaryCartsItem[]
}
export default function SummaryCards({ items }: Props) {
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
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(item.total)}
            </h3>

            <div
              className={`mt-3 flex items-center gap-2 text-sm ${
                isPositive ? 'text-[#0AA165]' : 'text-red-500'
              }`}
            >
              <span>
                {isPositive ? '+' : ''}
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(item.compared)}
              </span>
            </div>
          </div>
        )
      })}
    </>
  )
}
