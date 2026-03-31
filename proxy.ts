import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Retrieve the session user. This verifies the JWT securely on the server.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // =========================================================================
  // 1. UNAUTHENTICATED PROTECTION
  // =========================================================================
  const consumerProtected = ['/profile', '/fitting-room', '/wishlist']
  // /saas/login is the public B2B portal entry — exempt from auth requirement
  const saasPublic = ['/saas/login']
  const needsAuth =
    (path.startsWith('/saas') && !saasPublic.some((p) => path === p || path.startsWith(`${p}/`))) ||
    consumerProtected.some((r) => path === r || path.startsWith(`${r}/`))

  if (!user && needsAuth) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(redirectUrl)
  }

  // =========================================================================
  // 2. ROLE-BASED ACCESS CONTROL (RBAC) ENFORCEMENT
  // JWT claims are injected by custom_access_token_hook — zero DB round-trips.
  // =========================================================================
  if (user && path.startsWith('/saas')) {
    const systemRole = user.app_metadata?.system_role as string | undefined
    const storeRole = user.app_metadata?.store_role as string | undefined

    // TIER 1: Super Admin
    if (path.startsWith('/saas/admin') && systemRole !== 'SUPER_ADMIN') {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/unauthorized'
      return NextResponse.redirect(redirectUrl)
    }

    // TIER 2: Store Owner
    if (path.startsWith('/saas/owner')) {
      if (systemRole !== 'SUPER_ADMIN' && storeRole !== 'OWNER') {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/unauthorized'
        return NextResponse.redirect(redirectUrl)
      }
    }

    // TIER 3/4: Store Staff (Owner can also access staff pages)
    if (path.startsWith('/saas/staff')) {
      const staffRoles = ['OWNER', 'MANAGER', 'ASSOCIATE']
      if (
        systemRole !== 'SUPER_ADMIN' &&
        (!storeRole || !staffRoles.includes(storeRole))
      ) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/unauthorized'
        return NextResponse.redirect(redirectUrl)
      }
    }
  }

  // =========================================================================
  // 3. SMART LOGIN REDIRECTS
  // Authenticated users hitting /login are routed to their proper dashboard.
  // =========================================================================
  if (user && path === '/login') {
    const redirectUrl = request.nextUrl.clone()
    const systemRole = user.app_metadata?.system_role as string | undefined
    const storeRole = user.app_metadata?.store_role as string | undefined

    if (systemRole === 'SUPER_ADMIN') {
      redirectUrl.pathname = '/saas/admin'
    } else if (storeRole === 'OWNER') {
      redirectUrl.pathname = '/saas/owner'
    } else if (storeRole === 'MANAGER' || storeRole === 'ASSOCIATE') {
      redirectUrl.pathname = '/saas/staff'
    } else {
      redirectUrl.pathname = '/profile'
    }
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
