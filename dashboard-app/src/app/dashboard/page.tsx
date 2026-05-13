import Chart from '@/components/dashboard/Chart'

export default function DashboardPage() {
  return (
    <div
      id="container"
      className="max-auto p-auto mx-auto min-h-screen w-full max-w-full bg-blue-500 md:max-w-3xl lg:max-w-5xl"
    >
      <div
        id="navbar"
        className="flex items-center justify-between bg-gray-800 p-6 text-white"
      >
        <div id="back">back</div>
        <div id="title">Dashboard</div>
        <div id="menu">menu</div>
      </div>

      <div
        id="summary"
        className="flex items-center gap-4 bg-gray-200 p-6 text-gray-800"
      >
        <div
          id="summary-items"
          className="flex w-full flex-col items-center justify-center rounded-md border"
        >
          <div>Balance</div>
          <div>123456</div>
        </div>
        <div className="flex w-full flex-col items-center justify-center rounded-md border">
          <div>Income</div>
          <div>7890</div>
        </div>
        <div className="flex w-full flex-col items-center justify-center rounded-md border">
          <div>Expenses</div>
          <div>4567</div>
        </div>
      </div>
      <div
        id="chart"
        className="flex items-center gap-4 bg-gray-200 p-6 text-gray-800"
      >
        <Chart />
      </div>
      <div
        id="transactions"
        className="flex flex-col items-center gap-4 bg-gray-200 p-6 text-gray-800"
      >
        <div id="top" className="flex w-full items-center justify-between">
          <div>Latest Spending</div>
          <div>icon</div>
        </div>
        <div
          id="body"
          className="flex w-full flex-col gap-2 items-center justify-between"
        >
          <div
            id="body-item-container"
            className="flex w-full items-center justify-between rounded-xl bg-blue-300 p-2"
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
                <div id="name">Youtube</div>
                <div id="date">2024-06-01</div>
              </div>
            </div>
            <div
              id="body-item-container-right"
              className="w-2/3 gap-4 p-4 text-right"
            >
              price
            </div>
          </div>
           <div
            id="body-item-container"
            className="flex w-full items-center justify-between rounded-xl bg-blue-300 p-2"
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
                <div id="name">Youtube</div>
                <div id="date">2024-06-01</div>
              </div>
            </div>
            <div
              id="body-item-container-right"
              className="w-2/3 gap-4 p-4 text-right"
            >
              price
            </div>
          </div>
           <div
            id="body-item-container"
            className="flex w-full items-center justify-between rounded-xl bg-blue-300 p-2"
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
                <div id="name">Youtube</div>
                <div id="date">2024-06-01</div>
              </div>
            </div>
            <div
              id="body-item-container-right"
              className="w-2/3 gap-4 p-4 text-right"
            >
              price
            </div>
          </div>
          <div></div>
        </div>
        <div 
        id="bottom"
        className="flex w-full items-center justify-center rounded-3xl bg-gray-300 p-4"
        >
          <div>TRANSACTIONS</div>
        </div>
      </div>
    </div>
  )
}
