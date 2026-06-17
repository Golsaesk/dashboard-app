import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

function assertValidUrl(url: string | undefined): url is string {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const isConfigured = assertValidUrl(supabaseUrl) && !!supabaseAnonKey

if (!isConfigured && typeof window !== 'undefined') {
  console.error(
    '[Supabase] NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
      'are missing or invalid. Create a .env.local file at the project root ' +
      '(see .env.local.example) with real values from your Supabase project ' +
      '(Project Settings → API), then restart `npm run dev`. ' +
      `Current value of NEXT_PUBLIC_SUPABASE_URL: ${JSON.stringify(supabaseUrl)}`,
  )
}

export const supabaseConfigured = isConfigured
export const supabase = createBrowserClient(
  isConfigured ? supabaseUrl! : 'https://placeholder.invalid',
  isConfigured ? supabaseAnonKey! : 'placeholder-anon-key',
)
