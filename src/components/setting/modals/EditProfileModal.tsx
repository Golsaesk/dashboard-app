'use client'

import ProfileInformation from "../EditInformation"


type Props = {
  open: boolean
  onClose: () => void
}

export default function EditProfileModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 dark:bg-zinc-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Edit Profile</h2>

          <button
            onClick={onClose}
            className="rounded-xl bg-zinc-100 px-3 py-2"
          >
            Close
          </button>
        </div>

        <ProfileInformation />
      </div>
    </div>
  )
}
