"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { Badge } from "@/components/ui/badge"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RepoHistoryPage() {
  const params = useParams()
  // Next.js automatically pulls these from the folder names!
  const owner = params.owner as string
  const repoName = params.repo as string
  const fullRepoName = `${owner}/${repoName}`

  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRepoHistory() {
      try {
        const { data, error } = await supabase
          .from('review_history')
          .select('*')
          .eq('repo_name', fullRepoName)
          .order('created_at', { ascending: false })

        if (error) throw error
        setReviews(data || [])
      } catch (error) {
        console.error("Error fetching repo history:", error)
      } finally {
        setLoading(false)
      }
    }

    if (owner && repoName) fetchRepoHistory()
  }, [owner, repoName, fullRepoName])

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back Button */}
      <Link 
        href="/dashboard/repositories" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors mb-2"
      >
        <span className="mr-2">←</span> Back to Repositories
      </Link>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">{repoName}</h1>
        <p className="text-gray-400 mt-1">Review history for {fullRepoName}</p>
      </div>

      {/* Filtered History List */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/20 p-6">
        <h2 className="text-xl font-semibold mb-4 text-white">Pull Requests</h2>
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500 animate-pulse">Loading history...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">No PRs reviewed for this repository yet.</p>
          ) : (
            reviews.map((review) => (
              <Link href={`/dashboard/pr/${review.pr_number}`} key={review.id}>
                <div className="flex items-center justify-between p-4 border-b border-gray-800/50 last:border-0 hover:bg-gray-800/60 transition-colors rounded-lg cursor-pointer mt-2">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                        PR #{review.pr_number}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="text-gray-400 text-sm mt-1">
                      Logic Score: {review.logic_score}%
                    </span>
                  </div>
                  {review.bug_found ? (
                    <Badge variant="destructive">Bugs Found</Badge>
                  ) : (
                    <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Clean</Badge>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}