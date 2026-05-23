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
        <Button
          size="icon"
          className="h-14 w-14 rounded-full bg-[#0AA165] shadow-lg transition hover:scale-105 hover:opacity-90"
        >
          <Plus className="size-6 text-white" />
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
