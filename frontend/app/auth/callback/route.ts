import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function GET(request: Request) {
  // Grab the secret "code" GitHub just sent us in the URL
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // This is where we want to send them after everything succeeds
  const next = '/dashboard'

  if (code) {
    // THE FIX: Added 'await' right here! Next.js requires this now.
    const cookieStore = await cookies()
    
    // Create a secure server-side Supabase client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    
    // Exchange the GitHub code for a secure, permanent user session!
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Success! Teleport them to the dashboard.
      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.error("Auth error:", error)
    }
  }

  // If something went wrong or there's no code, kick them back to the home page
  return NextResponse.redirect(`${origin}/`)
}