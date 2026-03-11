import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  let supabaseStatus = "disconnected"
  
  try {
    // Attempt to connect to Supabase using your environment variables
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL, 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
      // A lightweight ping just to see if the database responds
      const { error } = await supabase.from('review_history').select('id').limit(1)
      if (!error) supabaseStatus = "connected"
    }
  } catch (error) {
    console.error("Supabase health check failed:", error)
  }

  // Return the statuses to the frontend
  return NextResponse.json({
    supabase: supabaseStatus,
    github: "active" // This stays active as long as the Next.js server is running
  })
}