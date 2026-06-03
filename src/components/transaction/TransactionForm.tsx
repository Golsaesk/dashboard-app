'use client'

import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { showToast } from '@/lib/notification/notification'
import { useAddTransaction } from '@/features/finance/hooks/useTransaction'
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
type Props = { onSuccess?: () => void }

export default function TransactionForm({ onSuccess }: Props) {
  const { mutateAsync: addTransaction, isPending } = useAddTransaction()

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

  async function onSubmit(values: TransactionSchemaType) {
    try {
      await addTransaction({
        category: values.category,
        amount: Number(values.amount),
        date: new Date(values.date).toISOString(),
        type: values.type,
      })
      showToast({ title: 'Transaction added' }, 'success')
      form.reset({
        amount: 0,
        category: '',
        source: '',
        note: '',
        type: 'income',
        date: new Date(),
      })
      onSuccess?.()
    } catch (err) {
      // FIX: error now shown to user — not just console.error
      showToast(
        { title: 'Failed to add transaction', message: (err as Error).message },
        'error',
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">
                Type
              </FormLabel>
              <div className="flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
                {/* FIX: Income correctly sets 'income' */}
                <button
                  type="button"
                  onClick={() => {
                    field.onChange('income')
                    form.setValue('category', '')
                  }}
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
                  onClick={() => {
                    field.onChange('outcome')
                    form.setValue('category', '')
                  }}
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

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">
                Date
              </FormLabel>
              <FormControl>
                <input
                  type="date"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-emerald-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">
                Amount
              </FormLabel>
              <FormControl>
                <div className="relative w-full">
                  <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-zinc-400">
                    $
                  </span>
                  <Input
                    type="number"
                    className="w-full rounded-xl pl-7 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">
                Category
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full rounded-xl dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:border-zinc-700 dark:bg-zinc-800">
                  {categories.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.value}
                      className="dark:text-white dark:focus:bg-zinc-700"
                    >
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">
                Source
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full rounded-xl dark:border-zinc-700 dark:bg-zinc-800 dark:text-white">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="dark:border-zinc-700 dark:bg-zinc-800">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-700 dark:text-zinc-300">
                Note
              </FormLabel>
              <FormControl>
                <Textarea
                  className="w-full rounded-xl dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {isPending ? 'Adding…' : 'Add Transaction'}
        </button>
      </form>
    </Form>
  )
}
