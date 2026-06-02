import { useSettingsStore } from '@/store/settingStore'

export const localeMap = {
  USD: 'en-US',
  EUR: 'de-DE',
  TRY: 'tr-TR',
} as const

export type Currency = keyof typeof localeMap

export function formatCurrency(value: number) {
  const currency = useSettingsStore.getState().currency

  return value.toLocaleString(localeMap[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  })
}

export function formatChartCurrency(value: number) {
  const currency = useSettingsStore.getState().currency

  return new Intl.NumberFormat(localeMap[currency], {
    notation: 'compact',
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}