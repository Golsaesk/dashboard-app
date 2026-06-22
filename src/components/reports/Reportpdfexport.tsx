'use client'

import { useState, useCallback } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Transaction } from '@/type/transaction'
import { useAuthStore } from '@/store/authStore'
import { useSettingsStore } from '@/store/settingStore'
import { DateRange, FilterState } from '@/providers/FilterContext'
import {
  getTotalIncome,
  getTotalOutcome,
  getNetSaving,
  getMonthlyAverage,
} from '@/helper/finance'

type Props = {
  transactions: Transaction[]
  dateRange: DateRange
  filter: FilterState
}

function getUserDisplayName(
  user: { email?: string; user_metadata?: Record<string, string> } | null,
) {
  if (!user) return 'User'
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'User'
  )
}

function formatAmount(value: number, currency: string): string {
  try {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    })
  } catch {
    return `${currency} ${value.toLocaleString()}`
  }
}

function formatDateShort(d: Date | null | string | undefined): string {
  if (!d) return '—'
  const dt = typeof d === 'string' ? new Date(d) : d
  if (isNaN(dt.getTime())) return '—'
  return dt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function groupByCategory(
  txs: Transaction[],
): { name: string; total: number; count: number }[] {
  const map: Record<string, { total: number; count: number }> = {}
  for (const t of txs) {
    const key = t.category || 'Other'
    if (!map[key]) map[key] = { total: 0, count: 0 }
    map[key].total += t.amount
    map[key].count++
  }
  return Object.entries(map)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.total - a.total)
}

function groupByMonth(
  txs: Transaction[],
): { month: string; income: number; expense: number }[] {
  const map: Record<string, { income: number; expense: number; ts: number }> =
    {}
  for (const t of txs) {
    if (!t.date) continue
    const d = new Date(t.date)
    if (isNaN(d.getTime())) continue
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    })
    if (!map[key]) map[key] = { income: 0, expense: 0, ts: d.getTime() }
    if (t.type === 'income') map[key].income += t.amount
    else map[key].expense += t.amount
  }
  return Object.entries(map)
    .sort((a, b) => a[1].ts - b[1].ts)
    .map(([key, v]) => {
      const [year, month] = key.split('-')
      const d = new Date(Number(year), Number(month) - 1, 1)
      return {
        month: d.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        income: v.income,
        expense: v.expense,
      }
    })
}

export default function ReportPDFExport({
  transactions,
  dateRange,
  filter,
}: Props) {
  const [loading, setLoading] = useState(false)
  const user = useAuthStore((s) => s.user)
  const currency = useSettingsStore((s) => s.currency)

  const generatePDF = useCallback(async () => {
    setLoading(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })
      const PAGE_W = 210
      const PAGE_H = 297
      const MARGIN = 18
      const CONTENT_W = PAGE_W - MARGIN * 2
      let y = MARGIN

      const userName = getUserDisplayName(user)
      const generatedAt = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

      const fmt = (v: number) => formatAmount(v, currency)
      const checkPage = (needed = 12) => {
        if (y + needed > PAGE_H - MARGIN) {
          doc.addPage()
          y = MARGIN
        }
      }

      const sectionTitle = (title: string) => {
        checkPage(16)
        y += 6
        doc.setFillColor(245, 247, 250)
        doc.roundedRect(MARGIN, y, CONTENT_W, 9, 2, 2, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(30, 30, 30)
        doc.text(title.toUpperCase(), MARGIN + 4, y + 6)
        y += 14
      }

      const row = (
        label: string,
        value: string,
        opts: { bold?: boolean; color?: [number, number, number] } = {},
      ) => {
        checkPage(8)
        doc.setFont('helvetica', opts.bold ? 'bold' : 'normal')
        doc.setFontSize(9)
        doc.setTextColor(...(opts.color ?? [60, 60, 60]))
        doc.text(label, MARGIN + 2, y)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...(opts.color ?? [20, 20, 20]))
        doc.text(value, PAGE_W - MARGIN - 2, y, { align: 'right' })
        y += 7
      }

      const divider = () => {
        checkPage(4)
        doc.setDrawColor(220, 220, 220)
        doc.setLineWidth(0.3)
        doc.line(MARGIN, y, PAGE_W - MARGIN, y)
        y += 4
      }
      doc.setFillColor(27, 58, 42)
      doc.rect(0, 0, PAGE_W, 48, 'F')
      doc.setFillColor(82, 183, 136)
      doc.circle(MARGIN + 7, 16, 7, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(255, 255, 255)
      doc.text('F', MARGIN + 4.5, 19.5)
      doc.setFontSize(18)
      doc.setTextColor(255, 255, 255)
      doc.text('Finova', MARGIN + 18, 19)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(82, 183, 136)
      doc.text('Financial Report', MARGIN + 18, 25.5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(200, 220, 210)
      doc.text(userName, PAGE_W - MARGIN, 16, { align: 'right' })
      doc.text(generatedAt, PAGE_W - MARGIN, 22, { align: 'right' })
      if (dateRange.from || dateRange.to) {
        const rangeStr = `${formatDateShort(dateRange.from)} → ${formatDateShort(dateRange.to)}`
        doc.setTextColor(82, 183, 136)
        doc.text(`Period: ${rangeStr}`, PAGE_W - MARGIN, 28, { align: 'right' })
      }

      y = 58
      sectionTitle('Financial Summary')

      const totalIncome = getTotalIncome(transactions)
      const totalOutcome = getTotalOutcome(transactions)
      const netSaving = getNetSaving(transactions)
      const monthlyAvg = getMonthlyAverage(transactions)
      const cardW = (CONTENT_W - 9) / 4
      const cardH = 22
      const cardColors: [number, number, number][] = [
        [232, 248, 239],
        [254, 235, 235],
        [230, 242, 255],
        [255, 248, 230],
      ]
      const cardLabels = [
        'Total Income',
        'Total Expenses',
        'Net Savings',
        'Monthly Avg',
      ]
      const cardValues = [totalIncome, totalOutcome, netSaving, monthlyAvg]
      const cardTextColors: [number, number, number][] = [
        [27, 118, 60],
        [185, 28, 28],
        [29, 78, 216],
        [146, 64, 14],
      ]

      for (let i = 0; i < 4; i++) {
        const cx = MARGIN + i * (cardW + 3)
        doc.setFillColor(...cardColors[i])
        doc.roundedRect(cx, y, cardW, cardH, 3, 3, 'F')
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7)
        doc.setTextColor(80, 80, 80)
        doc.text(cardLabels[i], cx + cardW / 2, y + 7, { align: 'center' })
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(...cardTextColors[i])
        doc.text(fmt(cardValues[i]), cx + cardW / 2, y + 15, {
          align: 'center',
        })
      }
      y += cardH + 10
      row('Total Transactions', `${transactions.length}`)
      divider()
      row('Income', fmt(totalIncome), { color: [27, 118, 60] })
      row('Expenses', fmt(totalOutcome), { color: [185, 28, 28] })
      row('Net Savings', fmt(netSaving), {
        bold: true,
        color: netSaving >= 0 ? [27, 118, 60] : [185, 28, 28],
      })
      if (filter.types.length > 0) {
        divider()
        row('Filtered Types', filter.types.join(', '))
      }
      if (filter.amountMin || filter.amountMax) {
        row(
          'Amount Range',
          `${fmt(Number(filter.amountMin) || 0)} – ${filter.amountMax ? fmt(Number(filter.amountMax)) : '∞'}`,
        )
      }
      const monthlyData = groupByMonth(transactions)
      if (monthlyData.length > 0) {
        sectionTitle('Monthly Breakdown')
        checkPage(8)
        doc.setFillColor(240, 243, 246)
        doc.rect(MARGIN, y, CONTENT_W, 7, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(80, 80, 80)
        doc.text('Month', MARGIN + 3, y + 5)
        doc.text('Income', MARGIN + CONTENT_W * 0.42, y + 5, { align: 'right' })
        doc.text('Expenses', MARGIN + CONTENT_W * 0.7, y + 5, {
          align: 'right',
        })
        doc.text('Net', MARGIN + CONTENT_W, y + 5, { align: 'right' })
        y += 9

        for (let i = 0; i < monthlyData.length; i++) {
          checkPage(8)
          const m = monthlyData[i]
          const net = m.income - m.expense
          if (i % 2 === 0) {
            doc.setFillColor(250, 251, 252)
            doc.rect(MARGIN, y - 3, CONTENT_W, 7, 'F')
          }
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8.5)
          doc.setTextColor(40, 40, 40)
          doc.text(m.month, MARGIN + 3, y + 2)
          doc.setTextColor(27, 118, 60)
          doc.text(fmt(m.income), MARGIN + CONTENT_W * 0.42, y + 2, {
            align: 'right',
          })
          doc.setTextColor(185, 28, 28)
          doc.text(fmt(m.expense), MARGIN + CONTENT_W * 0.7, y + 2, {
            align: 'right',
          })
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(
            net >= 0 ? 27 : 185,
            net >= 0 ? 118 : 28,
            net >= 0 ? 60 : 28,
          )
          doc.text(fmt(net), MARGIN + CONTENT_W, y + 2, { align: 'right' })
          y += 7
        }
      }
      const incomeGroups = groupByCategory(
        transactions.filter((t) => t.type === 'income'),
      )
      const expenseGroups = groupByCategory(
        transactions.filter((t) => t.type === 'expense' || t.type === 'cost'),
      )

      if (incomeGroups.length > 0) {
        sectionTitle('Income by Category')
        checkPage(8)
        doc.setFillColor(240, 243, 246)
        doc.rect(MARGIN, y, CONTENT_W, 7, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(80, 80, 80)
        doc.text('Category', MARGIN + 3, y + 5)
        doc.text('Transactions', MARGIN + CONTENT_W * 0.55, y + 5, {
          align: 'right',
        })
        doc.text('Amount', MARGIN + CONTENT_W, y + 5, { align: 'right' })
        y += 9

        for (let i = 0; i < incomeGroups.length; i++) {
          checkPage(8)
          const g = incomeGroups[i]
          const pct =
            totalIncome > 0 ? ((g.total / totalIncome) * 100).toFixed(1) : '0'

          if (i % 2 === 0) {
            doc.setFillColor(250, 251, 252)
            doc.rect(MARGIN, y - 3, CONTENT_W, 7, 'F')
          }
          doc.setFillColor(220, 240, 228)
          doc.roundedRect(MARGIN + 3, y - 1, CONTENT_W * 0.45, 3.5, 1, 1, 'F')
          doc.setFillColor(52, 168, 105)
          doc.roundedRect(
            MARGIN + 3,
            y - 1,
            Math.max(
              0.5,
              (CONTENT_W * 0.45 * g.total) / Math.max(incomeGroups[0].total, 1),
            ),
            3.5,
            1,
            1,
            'F',
          )

          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8.5)
          doc.setTextColor(40, 40, 40)
          doc.text(`${g.name} (${pct}%)`, MARGIN + 3, y + 4)
          doc.setTextColor(80, 80, 80)
          doc.text(`${g.count}`, MARGIN + CONTENT_W * 0.55, y + 4, {
            align: 'right',
          })
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(27, 118, 60)
          doc.text(fmt(g.total), MARGIN + CONTENT_W, y + 4, { align: 'right' })
          y += 8
        }
      }

      if (expenseGroups.length > 0) {
        sectionTitle('Expenses by Category')

        checkPage(8)
        doc.setFillColor(240, 243, 246)
        doc.rect(MARGIN, y, CONTENT_W, 7, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(80, 80, 80)
        doc.text('Category', MARGIN + 3, y + 5)
        doc.text('Transactions', MARGIN + CONTENT_W * 0.55, y + 5, {
          align: 'right',
        })
        doc.text('Amount', MARGIN + CONTENT_W, y + 5, { align: 'right' })
        y += 9

        for (let i = 0; i < expenseGroups.length; i++) {
          checkPage(8)
          const g = expenseGroups[i]
          const pct =
            totalOutcome > 0 ? ((g.total / totalOutcome) * 100).toFixed(1) : '0'

          if (i % 2 === 0) {
            doc.setFillColor(250, 251, 252)
            doc.rect(MARGIN, y - 3, CONTENT_W, 7, 'F')
          }

          doc.setFillColor(254, 220, 220)
          doc.roundedRect(MARGIN + 3, y - 1, CONTENT_W * 0.45, 3.5, 1, 1, 'F')
          doc.setFillColor(220, 50, 50)
          doc.roundedRect(
            MARGIN + 3,
            y - 1,
            Math.max(
              0.5,
              (CONTENT_W * 0.45 * g.total) /
                Math.max(expenseGroups[0].total, 1),
            ),
            3.5,
            1,
            1,
            'F',
          )

          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8.5)
          doc.setTextColor(40, 40, 40)
          doc.text(`${g.name} (${pct}%)`, MARGIN + 3, y + 4)
          doc.setTextColor(80, 80, 80)
          doc.text(`${g.count}`, MARGIN + CONTENT_W * 0.55, y + 4, {
            align: 'right',
          })
          doc.setFont('helvetica', 'bold')
          doc.setTextColor(185, 28, 28)
          doc.text(fmt(g.total), MARGIN + CONTENT_W, y + 4, { align: 'right' })
          y += 8
        }
      }
      if (transactions.length > 0) {
        sectionTitle(`All Transactions (${transactions.length})`)

        checkPage(10)
        doc.setFillColor(240, 243, 246)
        doc.rect(MARGIN, y, CONTENT_W, 7, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(80, 80, 80)
        doc.text('Date', MARGIN + 3, y + 5)
        doc.text('Category', MARGIN + 38, y + 5)
        doc.text('Type', MARGIN + CONTENT_W * 0.65, y + 5, { align: 'right' })
        doc.text('Amount', MARGIN + CONTENT_W, y + 5, { align: 'right' })
        y += 9

        const sorted = [...transactions].sort(
          (a, b) =>
            new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
        )

        for (let i = 0; i < sorted.length; i++) {
          checkPage(7)
          const t = sorted[i]
          const isIncome = t.type === 'income'

          if (i % 2 === 0) {
            doc.setFillColor(250, 251, 252)
            doc.rect(MARGIN, y - 2.5, CONTENT_W, 7, 'F')
          }

          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          doc.setTextColor(80, 80, 80)
          doc.text(formatDateShort(t.date), MARGIN + 3, y + 2)
          doc.setTextColor(30, 30, 30)
          const cat = (t.category || 'Other').slice(0, 22)
          doc.text(cat, MARGIN + 38, y + 2)
          doc.setTextColor(
            isIncome ? 27 : 185,
            isIncome ? 118 : 28,
            isIncome ? 60 : 28,
          )
          doc.text(t.type, MARGIN + CONTENT_W * 0.65, y + 2, { align: 'right' })
          doc.setFont('helvetica', 'bold')
          doc.text(
            `${isIncome ? '+' : '-'}${fmt(t.amount)}`,
            MARGIN + CONTENT_W,
            y + 2,
            { align: 'right' },
          )
          y += 7
        }
      }
      const totalPages = doc.getNumberOfPages()
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p)
        doc.setFillColor(245, 247, 250)
        doc.rect(0, PAGE_H - 12, PAGE_W, 12, 'F')
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7)
        doc.setTextColor(140, 140, 140)
        doc.text('Generated by Finova', MARGIN, PAGE_H - 5)
        doc.text(`Page ${p} of ${totalPages}`, PAGE_W - MARGIN, PAGE_H - 5, {
          align: 'right',
        })
        doc.text(
          new Date().toISOString().split('T')[0],
          PAGE_W / 2,
          PAGE_H - 5,
          {
            align: 'center',
          },
        )
      }
      const filename = `finova-report-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(filename)
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setLoading(false)
    }
  }, [transactions, user, currency, dateRange, filter])

  return (
    <button
      onClick={generatePDF}
      disabled={loading || transactions.length === 0}
      className="bg-primary text-primary-foreground flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Generating…
        </>
      ) : (
        <>
          <Download size={16} />
          Export PDF
        </>
      )}
    </button>
  )
}
