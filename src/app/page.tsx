'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const handleDemo = () => {
    // فقط مسیر + flag
    router.push('/dashboard?mode=demo')
  }

  const handleAuth = () => {
    router.push('/signin')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-5xl font-bold">Finance Dashboard</h1>
        <h3 className="text-xl text-zinc-600">Rule Your Financial Life</h3>
      </div>

      <div className="mt-10 flex gap-4">
        <button
          onClick={handleDemo}
          className="rounded-xl bg-green-500 px-6 py-3 text-white"
        >
          Get a Demo
        </button>

        <button onClick={handleAuth} className="rounded-xl border px-6 py-3">
          Sign Up / Login
        </button>
      </div>
    </div>
  )
}
