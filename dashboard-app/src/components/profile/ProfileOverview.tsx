import { ChevronRight } from 'lucide-react'

export default function ProfileOverview() {
  return (
    <div className="flex items-center justify-between border border-gray-200 shadow-sm rounded-xl p-4">
      <div className='flex items-center gap-4'>
        <div className="h-12 w-12 rounded-full bg-gray-500"></div>
        <div className="flex flex-col gap-4 text-zinc-600">
          <span>Golsa</span>
          <span>golsa@gmail.com</span>
        </div>
      </div>
      <div>
        <ChevronRight className='text-zinc-600'/>
      </div>
    </div>
  )
}
