'use client'

import Image from 'next/image'
import { Camera, User } from 'lucide-react'
import { ChangeEvent, useRef, useState } from 'react'

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/initials/svg?seed=User'

export default function ProfileInformation() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
  })

  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR)

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setAvatar(imageUrl)
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-zinc-200 dark:border-zinc-700">
          <Image
            src={avatar}
            alt="Profile"
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Edit Information
          </h2>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 dark:bg-white dark:text-zinc-900"
          >
            <Camera size={18} />
            Upload Photo
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Full Name
          </label>

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />

            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>

          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
            placeholder="Enter your email"
          />
        </div>
      </div>
    </div>
  )
}