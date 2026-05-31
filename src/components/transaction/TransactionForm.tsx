'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
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
import { transactionSchema, TransactionSchemaType } from '@/schema/transaction.schema'

type Props = {
  onSuccess?: () => void
}

export function TransactionForm({ onSuccess }: Props) {
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
      amount: 0, category: '', source: '', note: '',
      type: 'income', date: new Date(), attachment: undefined,
    })
    onSuccess?.()
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
              <FormLabel className="text-zinc-700 dark:text-zinc-300">Type</FormLabel>
              <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => { field.onChange('income'); form.setValue('category', '') }}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                    field.value === 'income'
                      ? 'bg-white text-emerald-600 shadow-sm dark:bg-zinc-700 dark:text-emerald-400'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => { field.onChange('outcome'); form.setValue('category', '') }}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                    field.value === 'outcome'
                      ? 'bg-white text-red-500 shadow-sm dark:bg-zinc-700 dark:text-red-400'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                  }`}
                >
                  Outcome
                </button>
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
              <FormLabel className="text-zinc-700 dark:text-zinc-300">Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-400">$</span>
                  <Input
                    type="number"
                    className="rounded-xl pl-7 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
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
              <FormLabel className="text-zinc-700 dark:text-zinc-300">Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:border-zinc-700 dark:bg-zinc-800">
                  {categories.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="dark:text-white dark:focus:bg-zinc-700">
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
              <FormLabel className="text-zinc-700 dark:text-zinc-300">Source</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:border-zinc-700 dark:bg-zinc-800">
                  <SelectItem value="cash" className="dark:text-white dark:focus:bg-zinc-700">Cash</SelectItem>
                  <SelectItem value="bank" className="dark:text-white dark:focus:bg-zinc-700">Bank</SelectItem>
                  <SelectItem value="wallet" className="dark:text-white dark:focus:bg-zinc-700">Wallet</SelectItem>
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
              <FormLabel className="text-zinc-700 dark:text-zinc-300">Note</FormLabel>
              <FormControl>
                <Textarea
                  className="rounded-xl dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder-zinc-500"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Add Transaction
        </button>
      </form>
    </Form>
  )
}