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

type Props = {
  onSuccess?: () => void
}

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
        source: values.source,
        note: values.note,
        attachment: values.attachment,
        created_at: new Date(),
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
      showToast(
        {
          title: 'Failed to add transaction',
          message: (err as Error).message,
        },
        'error',
      )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>

              <div className="border-border bg-muted flex gap-1 rounded-xl border p-1">
                <button
                  type="button"
                  onClick={() => {
                    field.onChange('income')
                    form.setValue('category', '')
                  }}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                    field.value === 'income'
                      ? 'border-border bg-card text-primary border shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Income
                </button>

                <button
                  type="button"
                  onClick={() => {
                    field.onChange('expense')
                    form.setValue('category', '')
                  }}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                    field.value === 'expense'
                      ? 'border-border bg-card text-warning border shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Expense
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
              <FormLabel>Date</FormLabel>

              <FormControl>
                <input
                  type="date"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  className="border-border bg-card text-foreground focus:ring-ring w-full rounded-xl border px-3 py-2 text-sm transition outline-none focus:ring-2"
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
              <FormLabel>Amount</FormLabel>

              <FormControl>
                <div className="relative">
                  <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                    $
                  </span>

                  <Input
                    type="number"
                    className="border-border bg-card pl-7"
                    value={field.value}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>

              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="border-border bg-card">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="border-border bg-popover">
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

        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>

              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="border-border bg-card">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="border-border bg-popover">
                  <SelectItem value="cash">Cash</SelectItem>

                  <SelectItem value="bank">Bank</SelectItem>

                  <SelectItem value="wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>

              <FormControl>
                <Textarea {...field} className="border-border bg-card" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <button
          type="submit"
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>
    </Form>
  )
}
