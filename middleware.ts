import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge-level RBAC middleware — first line of defence before any layout or page runs.
 *
 * Route → required role(s):
 *   /saas/admin/*  → SUPER_ADMIN
 *   /saas/owner/*  → SUPER_ADMIN | OWNER
 *   /saas/staff/*  → SUPER_ADMIN | OWNER | MANAGER | ASSOCIATE
 *
 * Layout-level guards remain in place as a second layer (defence in depth).
 */
export async function middleware(request: NextRequest) {
  // Must be mutable so the cookie setter can replace it with an updated response.
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Forward cookies to both the outgoing request and the response so the
          // refreshed session token is visible to downstream Server Components.
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() validates the JWT server-side — never trust getSession() alone in middleware.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const loginUrl = (redirect?: string) => {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    if (redirect) url.searchParams.set('redirect', redirect)
    return url
  }

  const unauthorizedUrl = () => {
    const url = request.nextUrl.clone()
    url.pathname = '/unauthorized'
    return url
  }

  // ── /saas/admin — SUPER_ADMIN only ───────────────────────────────────────
  if (pathname.startsWith('/saas/admin')) {
    if (!user) return NextResponse.redirect(loginUrl(pathname))
    const systemRole = user.app_metadata?.system_role as string | undefined
    if (systemRole !== 'SUPER_ADMIN') return NextResponse.redirect(unauthorizedUrl())
  }

  // ── /saas/owner — SUPER_ADMIN | OWNER ────────────────────────────────────
  else if (pathname.startsWith('/saas/owner')) {
    if (!user) return NextResponse.redirect(loginUrl(pathname))
    const systemRole = user.app_metadata?.system_role as string | undefined
    const storeRole  = user.app_metadata?.store_role  as string | undefined
    if (systemRole !== 'SUPER_ADMIN' && storeRole !== 'OWNER') {
      return NextResponse.redirect(unauthorizedUrl())
    }
  }

  // ── /saas/staff — SUPER_ADMIN | OWNER | MANAGER | ASSOCIATE ──────────────
  else if (pathname.startsWith('/saas/staff')) {
    if (!user) return NextResponse.redirect(loginUrl(pathname))
    const systemRole = user.app_metadata?.system_role as string | undefined
    const storeRole  = user.app_metadata?.store_role  as string | undefined
    const staffRoles = ['OWNER', 'MANAGER', 'ASSOCIATE']
    if (systemRole !== 'SUPER_ADMIN' && (!storeRole || !staffRoles.includes(storeRole))) {
      return NextResponse.redirect(unauthorizedUrl())
    }
  }

  return response
}

export const config = {
  // Run on every /saas/* path; skip static assets and image optimisation routes.
  matcher: ['/saas/:path*'],
}
