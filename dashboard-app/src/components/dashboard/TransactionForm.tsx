'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTransaction } from '@/lib/transaction.action'
import { transactionSchema, TransactionForm } from '../../lib/schema'

export default function TransactionFormComponent() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
  })

  const onSubmit = async (data: TransactionForm) => {
    await createTransaction(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* type */}
      <select {...register('type')}>
        <option value="income">Income</option>
        <option value="outcome">Outcome</option>
      </select>

      {/* category */}
      <input {...register('category')} placeholder="category" />

      {/* amount */}
      <input
        type="number"
        {...register('amount', { valueAsNumber: true })}
        placeholder="amount"
      />

      {/* date */}
      <input type="date" {...register('date')} />

      <button disabled={isSubmitting}>Save</button>

      {/* errors */}
      {errors.category && <p>category required</p>}
      {errors.amount && <p>invalid amount</p>}
    </form>
  )
}
