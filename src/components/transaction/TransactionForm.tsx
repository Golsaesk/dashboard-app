'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFinanceStore } from '@/store/financeStore'
import { INCOME_CATEGORIES, OUTCOME_CATEGORIES } from '@/config/category.config'
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
  const addTransaction = useFinanceStore((state) => state.addTransaction)

  const form = useForm<TransactionSchemaType>({
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

  const type = form.watch('type')

  const categories = type === 'income' ? INCOME_CATEGORIES : OUTCOME_CATEGORIES

  function onSubmit(values: TransactionSchemaType) {
    addTransaction({
      name: values.category,
      amount: Number(values.amount),
      date: new Date(values.date).toISOString(),
      type: values.type,
    })

    form.reset({
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  className="flex-1"
                  onClick={() => {
                    field.onChange('income')
                    form.setValue('category', '')
                  }}
                >
                  Income
                </Button>

                <Button
                  type="button"
                  variant={field.value === 'outcome' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => {
                    field.onChange('outcome')
                    form.setValue('category', '')
                  }}
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
                  className="rounded-xl"
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
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
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
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
                  <SelectTrigger className="rounded-xl">
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
                <Textarea className="rounded-xl" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full rounded-xl bg-[#0AA165] py-6 text-white hover:opacity-90"
        >
          Add Transaction
        </Button>
      </form>
    </Form>
  )
}
