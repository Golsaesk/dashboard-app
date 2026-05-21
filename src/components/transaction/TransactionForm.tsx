'use client'

import { v4 as uuid } from 'uuid'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFinanceStore } from '@/store/financeStore'
import {
  transactionSchema,
  TransactionSchemaType,
} from '@/schema/transaction.schema'
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

export function TransactionForm() {
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
    }),
    addTransaction = useFinanceStore((state) => state.addTransaction)

  async function onSubmit(values: TransactionSchemaType) {
    addTransaction({
      id: uuid(),
      name: values.category,
      amount: values.amount,
      date: new Date(values.date).toISOString(),
      type: values.type,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* type */}
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

              <FormMessage />
            </FormItem>
          )}
        />

        {/* amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>

              <FormControl>
                <Input type="number" placeholder="100" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              <FormMessage />
            </FormItem>
          )}
        />

        {/* source */}
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              <FormMessage />
            </FormItem>
          )}
        />

        {/* date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>

              <FormControl>
                <Input
                  type="date"
                  value={
                    field.value
                      ? new Date(field.value).toISOString().split('T')[0]
                      : ''
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* note */}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>

              <FormControl>
                <Textarea placeholder="write note..." {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* attachment */}
        <FormField
          control={form.control}
          name="attachment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attachment</FormLabel>

              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>

              <FormMessage />
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
