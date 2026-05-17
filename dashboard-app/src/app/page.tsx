import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
          Finance Dashboard
        </h1>

        <h3 className="text-xl text-zinc-600">Rule Your Financial Life</h3>
      </div>

      <div className="mt-10 flex gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0AA165] to-[#2dbb84] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0AA165]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#0AA165]/35 focus:ring-2 focus:ring-[#2dbb84] focus:ring-offset-2 focus:outline-none active:scale-[0.98]"
        >
          Get a Demo
        </Link>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl border border-[#0AA165]/30 bg-white px-6 py-3 text-sm font-semibold text-[#0AA165] transition-all duration-300 hover:bg-[#0AA165]/5"
        >
          Sign Up
        </Link>
      </div>
    </div>
  )
}
