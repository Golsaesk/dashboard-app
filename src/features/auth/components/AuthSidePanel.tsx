// export function AuthSidePanel() {
//   return (
//     <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0AA165] to-emerald-700 p-12 text-white lg:flex">
//       <div>
//         <h1 className="text-5xl leading-tight font-bold">
//           Rule Your
//           <br />
//           Financial Life
//         </h1>

//         <p className="mt-6 max-w-md text-lg text-white/80">
//           Track income, expenses, savings, and goals in one intelligent
//           dashboard.
//         </p>
//       </div>

//       <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
//         <p className="text-sm text-white/70">Monthly Savings</p>

//         <h2 className="mt-2 text-4xl font-bold">+$4,250</h2>

//         <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
//           <div className="h-full w-[72%] rounded-full bg-white" />
//         </div>

//         <p className="mt-3 text-sm text-white/70">
//           72% of your monthly goal reached
//         </p>
//       </div>
//     </div>
//   )
// }
export function AuthSidePanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-emerald-600 p-12 text-white lg:flex dark:bg-emerald-800">
      {/* Decorative circle */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/5" />

      <div className="relative">
        <h1 className="text-4xl leading-tight font-semibold">
          Rule Your
          <br />
          Financial Life
        </h1>
        <p className="mt-4 max-w-sm text-base text-white/75">
          Track income, expenses, savings, and goals in one intelligent
          dashboard.
        </p>
      </div>

      <div className="relative rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
        <p className="text-sm text-white/65">Monthly Savings</p>
        <h2 className="mt-1.5 text-3xl font-semibold">+$4,250</h2>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/20">
          <div className="h-full w-[72%] rounded-full bg-white" />
        </div>
        <p className="mt-2.5 text-sm text-white/65">
          72% of your monthly goal reached
        </p>
      </div>
    </div>
  )
}
