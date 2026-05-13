export default function Summary() {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-6">
      <div className="flex aspect-square w-40 flex-col justify-center gap-6 rounded-md border border-gray-200 p-4">
        <div className="">
          <h3 className="font-small text-small text-black">Balance</h3>
        </div>
        <div className="text-2xl font-semibold text-black">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(1234.56)}
        </div>
      </div>
      <div className="flex aspect-square w-40 flex-col justify-center gap-6 rounded-md border border-gray-200 p-4">
        <div className="">
          <h3 className="font-small text-small text-black">Income</h3>
        </div>
        <div className="text-2xl font-semibold text-black">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(3456.56)}
        </div>
      </div>
      <div className="flex aspect-square w-40 flex-col justify-center gap-6 rounded-md border border-gray-200 p-4">
        <div className="">
          <h3 className="font-small text-small text-black">Expenses</h3>
        </div>
        <div className="text-2xl font-semibold text-black">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(1298.56)}
        </div>
      </div>
    </div>
  )
}
