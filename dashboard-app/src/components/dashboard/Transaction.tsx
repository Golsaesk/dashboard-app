export default function Transaction() {
  return (
    <div
      id="transactions"
      className="flex flex-col items-center gap-4 bg-gray-100 p-6 text-gray-800"
    >
      <div id="top" className="flex w-full items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Latest Spending</h2>
        </div>
        <div>icon</div>
      </div>
      <div
        id="body"
        className="flex w-full flex-col items-center justify-between gap-2"
      >
        <div
          id="body-item-container"
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-2"
        >
          <div
            id="body-item-container-left"
            className="flex w-1/3 items-center gap-4"
          >
            <div
              id="body-item-container-left-photo"
              className="h-12 w-12 rounded-full bg-gray-500"
            ></div>
            <div
              id="body-item-container-left-title"
              className="flex flex-col items-start gap-1"
            >
              <div>
                <h2 className="text-sm">Youtube</h2>
              </div>
              <div id="date">2024-06-01</div>
            </div>
          </div>
          <div
            id="body-item-container-right"
            className="w-2/3 gap-4 p-4 text-right"
          >
            <div className="text-lg text-red-500">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(3456.56)}
            </div>
          </div>
        </div>
        <div
          id="body-item-container"
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-2"
        >
          <div
            id="body-item-container-left"
            className="flex w-1/3 items-center gap-4"
          >
            <div
              id="body-item-container-left-photo"
              className="h-12 w-12 rounded-full bg-gray-500"
            ></div>
            <div
              id="body-item-container-left-title"
              className="flex flex-col items-start gap-1"
            >
              <div>
                <h2 className="text-sm">Youtube</h2>
              </div>
              <div id="date">2024-06-01</div>
            </div>
          </div>
          <div
            id="body-item-container-right"
            className="w-2/3 gap-4 p-4 text-right"
          >
            <div className="text-lg text-red-500">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(3456.56)}
            </div>
          </div>
        </div>
        <div
          id="body-item-container"
          className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-2"
        >
          <div
            id="body-item-container-left"
            className="flex w-1/3 items-center gap-4"
          >
            <div
              id="body-item-container-left-photo"
              className="h-12 w-12 rounded-full bg-gray-500"
            ></div>
            <div
              id="body-item-container-left-title"
              className="flex flex-col items-start gap-1"
            >
              <div>
                <h2 className="text-sm">Youtube</h2>
              </div>
              <div id="date">2024-06-01</div>
            </div>
          </div>
          <div
            id="body-item-container-right"
            className="w-2/3 gap-4 p-4 text-right"
          >
            <div className="text-lg text-red-500">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(3456.56)}
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div
        id="bottom"
        className="flex w-full items-center justify-center rounded-3xl bg-gray-300 p-4"
      >
        <div>ADD TRANSACTIONS</div>
      </div>
    </div>
  )
}
