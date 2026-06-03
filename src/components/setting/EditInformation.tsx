'use client'

import Image from 'next/image'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase/client'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Camera, User, Mail, Loader2, Check } from 'lucide-react'

type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/initials/svg?seed=User'

export default function ProfileInformation() {
  const [avatar, setAvatar] = useState<string>(DEFAULT_AVATAR),
    [avatarFile, setAvatarFile] = useState<File | null>(null),
    [saveStatus, setSaveStatus] = useState<SaveStatus>('idle'),
    [errorMessage, setErrorMessage] = useState(''),
    fileInputRef = useRef<HTMLInputElement | null>(null),
    user = useAuthStore((s) => s.user),
    setAuth = useAuthStore((s) => s.setAuth),
    [formData, setFormData] = useState({
      fullName: '',
      email: '',
    })

  useEffect(() => {
    if (!user) return
    setFormData({
      fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
      email: user.email || '',
    })
  }, [user])

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatar(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    if (!user) return

    setSaveStatus('saving')
    setErrorMessage('')

    try {
      let avatarUrl: string | undefined
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop()
        const path = `avatars/${user.id}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(path)

        avatarUrl = urlData.publicUrl
      }

      const metadataUpdate: Record<string, string> = {
        full_name: formData.fullName,
      }
      if (avatarUrl) metadataUpdate.avatar_url = avatarUrl

      const { data: updatedUser, error: metaError } =
        await supabase.auth.updateUser({ data: metadataUpdate })

      if (metaError) throw metaError

      const profileUpdate: Record<string, string> = {
        full_name: formData.fullName,
      }
      if (avatarUrl) profileUpdate.avatar_url = avatarUrl

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.id)

      if (profileError) throw profileError

      if (updatedUser.user) {
        setAuth({ user: updatedUser.user })
      }

      setAvatarFile(null)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2500)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes'
      setErrorMessage(msg)
      setSaveStatus('error')
    }
  }

  const isDirty =
    formData.fullName !==
      (user?.user_metadata?.full_name || user?.user_metadata?.name || '') ||
    avatarFile !== null

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-zinc-200 dark:border-zinc-700">
          <Image
            src={
              avatar !== DEFAULT_AVATAR
                ? avatar
                : (user?.user_metadata?.avatar_url ?? DEFAULT_AVATAR)
            }
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
            <Camera size={16} />
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
            <User
              className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fullName: e.target.value }))
              }
              className="w-full rounded-xl border border-zinc-300 bg-white py-3 pr-4 pl-10 text-sm transition outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>

          <div className="relative">
            <Mail
              className="absolute top-1/2 left-3 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-3 pr-4 pl-10 text-sm text-zinc-400 outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500"
              placeholder="Email cannot be changed here"
            />
          </div>
          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            Email changes require re-verification.
          </p>
        </div>
      </div>
      {saveStatus === 'error' && (
        <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
      )}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={!isDirty || saveStatus === 'saving'}
          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-zinc-900"
        >
          {saveStatus === 'saving' && (
            <Loader2 size={15} className="animate-spin" />
          )}
          {saveStatus === 'success' && (
            <Check size={15} className="text-emerald-400" />
          )}
          {saveStatus === 'saving'
            ? 'Saving...'
            : saveStatus === 'success'
              ? 'Saved!'
              : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
