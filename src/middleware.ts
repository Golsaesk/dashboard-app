import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PROTECTED_PATHS = [
  '/dashboard',
  '/income',
  '/outcome',
  '/reports',
  '/profile',
  '/setting',
  '/pricing',
]

const AUTH_PATHS = ['/signin', '/auth']

function isProtected(path: string): boolean {
  return PROTECTED_PATHS.some((p) => path === p || path.startsWith(p + '/'))
}

function isAuthRoute(path: string): boolean {
  return AUTH_PATHS.some((p) => path === p || path.startsWith(p + '/'))
}

function isValidUrl(url: string | undefined): url is string {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next(),
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    configured = isValidUrl(supabaseUrl) && !!supabaseAnonKey,
    path = req.nextUrl.pathname

  if (!configured) {
    console.error(
      '[middleware] NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY ' +
        'are missing or invalid. Create .env.local from .env.local.example ' +
        'and restart the dev server. Auth checks are skipped until then.',
    )
    if (isProtected(path)) {
      const redirectUrl = new URL('/signin', req.url)
      redirectUrl.searchParams.set('next', path)
      return NextResponse.redirect(redirectUrl)
    }
    return res
  }

  const supabase = createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options)
        })
      },
    },
  })

  let user = null
  try {
    const {
      data: { user: fetchedUser },
    } = await supabase.auth.getUser()
    user = fetchedUser
  } catch (err) {
    console.error('[middleware] Failed to fetch Supabase session:', err)
  }

  if (!user && isProtected(path)) {
    const redirectUrl = new URL('/signin', req.url)
    redirectUrl.searchParams.set('next', path)
    return NextResponse.redirect(redirectUrl)
  }
  if (user && isAuthRoute(path)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
  if (!user && path.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
