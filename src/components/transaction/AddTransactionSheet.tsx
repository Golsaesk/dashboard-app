'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TransactionForm } from './TransactionForm'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

export function AddTransactionSheet() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="flex h-14 w-14 items-center justify-center gap-2 rounded-lg bg-[#0AA165] p-0 shadow-lg transition hover:opacity-90 lg:w-auto lg:px-5">
          <Plus className="size-6 text-white" />
          <span className="hidden text-sm font-medium text-white lg:inline">
            Add Transaction
          </span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mx-auto w-full max-w-md rounded-t-3xl">
        <DrawerHeader className="border-b border-zinc-100">
          <DrawerTitle className="text-center text-lg">
            Add Transaction
          </DrawerTitle>
        </DrawerHeader>
        <div className="max-h-[75vh] overflow-y-auto px-5 py-4">
          <TransactionForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
