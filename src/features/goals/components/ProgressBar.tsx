// type Props = {
//   value: number
//   current?: number
//   total?: number
// }

// export default function ProgressBar({ value, current, total }: Props) {
//   const safeValue = Math.min(Math.max(value, 0), 100)

//   return (
//     <div className="w-full">
//       {/* top info */}
//       <div className="mb-1 flex justify-between text-xs text-zinc-400">
//         <span>Progress</span>
//         <span className="font-semibold text-emerald-600">
//           {safeValue}%
//         </span>
//       </div>

//       {/* bar */}
//       <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200">
//         <div
//           className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
//           style={{ width: `${safeValue}%` }}
//         />
//       </div>

//       {/* amounts */}
//       {current !== undefined && total !== undefined && (
//         <div className="mt-1 flex justify-between text-xs text-zinc-400">
//           <span>${current.toLocaleString()}</span>
//           <span>${total.toLocaleString()}</span>
//         </div>
//       )}
//     </div>
//   )
// }