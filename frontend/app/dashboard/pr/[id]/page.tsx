"use client"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import ReactMarkdown from "react-markdown"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function PRDetailsPage() {
  const params = useParams()
  const prNumber = params.id
  const router = useRouter()

  const [review, setReview] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReview() {
      try {
        const { data, error } = await supabase
          .from('review_history')
          .select('*')
          .eq('pr_number', prNumber)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error) throw error
        setReview(data)
      } catch (error) {
        console.error("Error fetching PR details:", error)
      } finally {
        setLoading(false)
      }
    }
    
    if (prNumber) fetchReview()
  }, [prNumber])

  if (loading) return <div className="p-8 text-gray-400 animate-pulse">Loading AI Report...</div>
  if (!review) return <div className="p-8 text-red-400">PR not found in the database.</div>

    return (
    <div className="space-y-6 max-w-4xl">
    {/* The Dynamic Back Button */}
      <button 
        onClick={() => router.back()}
        className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-2 bg-transparent border-none p-0 cursor-pointer"
      >
        <span className="mr-2">←</span> Go Back
      </button>

      <div>
        <h1 className="text-3xl font-bold">PR #{review.pr_number} Analysis</h1>
        <p className="text-gray-400 mt-2">{review.repo_name}</p>
      </div>

      <div className="flex gap-4">
        {review.bug_found ? (
          <Badge variant="destructive" className="text-sm px-3 py-1">⚠️ Bugs Detected</Badge>
        ) : (
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-sm px-3 py-1">✅ Clean Code</Badge>
        )}
        <Badge variant="outline" className="text-blue-400 border-blue-400/50 text-sm px-3 py-1">
          Logic Score: {review.logic_score}%
        </Badge>
      </div>

      <Card className="bg-gray-900/40 border-gray-800 mt-8">
        <CardHeader>
          <CardTitle className="text-xl text-gray-200">Multi-Agent Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-black/50 p-8 border border-gray-800/50 text-gray-300">
            {/* Here is the magic: ReactMarkdown turns the raw symbols into beautiful HTML */}
 <ReactMarkdown
              components={{
                h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-white mt-8 mb-4 border-b border-gray-800 pb-2" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-blue-400" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />,
                code: ({node, className, children, ...props}: any) => {
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    // Block Code (Like your Python functions)
                    <code className="block bg-gray-950 p-4 overflow-x-auto text-green-400 font-mono text-sm rounded-md border border-gray-800 my-4" {...props}>
                      {children}
                    </code>
                  ) : (
                    // Inline Code (Like `small variable names` inside paragraphs)
                    <code className="bg-gray-800 px-1.5 py-0.5 rounded text-pink-400 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {review.report_text || "No detailed text was saved for this review yet."}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}