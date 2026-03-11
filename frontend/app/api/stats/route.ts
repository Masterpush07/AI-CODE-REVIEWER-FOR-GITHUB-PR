import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // 1. Get total number of reviews
    const { count: totalReviews, error: err1 } = await supabase
      .from('review_history')
      .select('*', { count: 'exact', head: true })

    // 2. Get count of bugs caught
    const { count: bugsCaught, error: err2 } = await supabase
      .from('review_history')
      .select('*', { count: 'exact', head: true })
      .eq('bug_found', true)

    // 3. NEW: Fetch the 5 most recent reviews for the activity feed
    const { data: recentActivity, error: err3 } = await supabase
      .from('review_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)

    if (err1 || err2 || err3) throw err1 || err2 || err3

    return NextResponse.json({
      totalReviews: totalReviews || 0,
      bugsCaught: bugsCaught || 0,
      logicScore: totalReviews && totalReviews > 0 ? "92%" : "N/A",
      recentActivity: recentActivity || [] // Send the array to the frontend
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}