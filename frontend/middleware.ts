import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Next.js demands exactly this function name!
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Create the secure connection
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
          })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 2. Check if the user has a valid ID badge (session)
  const { data: { user } } = await supabase.auth.getUser()

  // 3. THE BOUNCER LOGIC
  // If no user is found AND they are trying to sneak into the dashboard...
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    // ...kick them back to the home page!
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// This tells Next.js exactly which routes to run the Bouncer on
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}