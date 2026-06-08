'use client'

import React from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

type Props = {
  onClose: () => void
  title: string
  subtitle: string
  children: React.ReactNode
}

export default function ModalShell({
  onClose,
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="ml-4 shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </motion.div>
    </div>
  )
}
