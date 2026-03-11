import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    // Fetch all reviews, newest first
    const { data, error } = await supabase
      .from('review_history')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Group the data by repository name
    const repos: Record<string, any> = {}

    data?.forEach((review) => {
      const repoName = review.repo_name
      
      // If we haven't seen this repo yet, set up its starting stats
      if (!repos[repoName]) {
        repos[repoName] = {
          name: repoName,
          totalReviews: 0,
          bugsCaught: 0,
          lastReview: review.created_at, // Newest date since we ordered by descending
          status: 'Active'
        }
      }
      
      // Add to the totals
      repos[repoName].totalReviews += 1
      if (review.bug_found) {
        repos[repoName].bugsCaught += 1
      }
    })

    // Convert our grouped object back into an array for the frontend
    const repoArray = Object.values(repos)

    return NextResponse.json(repoArray)
  } catch (error) {
    console.error("Error fetching repos:", error)
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 })
  }
}