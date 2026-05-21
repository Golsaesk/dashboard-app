'use client'

import { v4 as uuid } from 'uuid'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFinanceStore } from '@/store/financeStore'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  transactionSchema,
  TransactionSchemaType,
} from '@/schema/transaction.schema'

export function TransactionForm() {
  const addTransaction = useFinanceStore((state) => state.addTransaction),
    form = useForm<TransactionSchemaType>({
      resolver: zodResolver(transactionSchema),

      defaultValues: {
        amount: 0,
        category: '',
        source: '',
        note: '',
        type: 'income',
        date: new Date(),
        attachment: undefined,
      },
    })

  function onSubmit(values: TransactionSchemaType) {
    addTransaction({
      id: uuid(),
      name: values.category,
      amount: Number(values.amount), // ✅ FIX 1
      date:
        values.date instanceof Date
          ? values.date.toISOString()
          : new Date(values.date).toISOString(), // ✅ FIX 2
      type: values.type,
    })

    form.reset({
      // ✅ FIX 3
      amount: 0,
      category: '',
      source: '',
      note: '',
      type: 'income',
      date: new Date(),
      attachment: undefined,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* TYPE */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={field.value === 'income' ? 'default' : 'outline'}
                  onClick={() => field.onChange('income')}
                >
                  Income
                </Button>

                <Button
                  type="button"
                  variant={field.value === 'outcome' ? 'default' : 'outline'}
                  onClick={() => field.onChange('outcome')}
                >
                  Outcome
                </Button>
              </div>
            </FormItem>
          )}
        />

        {/* AMOUNT */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  value={field.value}
                  onChange={
                    (e) => field.onChange(Number(e.target.value)) // ✅ FIX 4
                  }
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* CATEGORY */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>

              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* SOURCE */}
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>

              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* NOTE */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>

              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Transaction
        </Button>
      </form>
    </Form>
  )
}
