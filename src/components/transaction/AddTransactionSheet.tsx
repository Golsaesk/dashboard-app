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
        <Button size="icon" className="h-16 w-16 rounded-full shadow-xl">
          <Plus className="size-7" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Add Transaction</DrawerTitle>
        </DrawerHeader>

        <div className="overflow-y-auto px-4 pb-6">
          <TransactionForm />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
