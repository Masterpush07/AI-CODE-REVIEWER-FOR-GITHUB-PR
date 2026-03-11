"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RepositoriesPage() {
  const [repos, setRepos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // State to control our pop-up modal
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch('/api/repositories')
        const data = await response.json()
        setRepos(data)
      } catch (error) {
        console.error("Error fetching repositories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRepos()
  }, [])

  return (
    <div className="space-y-8 relative">
      {/* Header & The Connect Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Repositories</h1>
          <p className="text-gray-400">Manage your connected GitHub projects.</p>
        </div>
        {/* OnClick handler added to open the modal */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm flex items-center gap-2"
        >
          <span>➕</span> Connect Repository
        </button>
      </div>

      {/* Grid Area */}
      {loading ? (
        <div className="text-gray-400 animate-pulse">Loading repositories...</div>
      ) : repos.length === 0 ? (
        <div className="text-gray-500 bg-gray-900/20 p-8 rounded-xl border border-gray-800 text-center">
          No repositories found. Connect one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            // NEW: The Link wrapper makes the whole card clickable!
            <Link href={`/dashboard/repositories/${repo.name}`} key={repo.name} className="block h-full">
              <Card className="bg-gray-900/40 border-gray-800 hover:border-gray-600 transition-colors cursor-pointer h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-800/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📁</span>
                    <CardTitle className="text-lg font-medium text-gray-200">
                      {repo.name.split('/')[1] || repo.name}
                    </CardTitle>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    Active
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total PRs Reviewed:</span>
                    <span className="font-bold text-white">{repo.totalReviews}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Bugs Caught:</span>
                    <span className="font-bold text-red-400">{repo.bugsCaught}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last Activity:</span>
                    <span className="text-gray-300">
                      {new Date(repo.lastReview).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* The Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-xl max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Connect New Repository</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-white transition-colors text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 text-gray-300 text-sm">
              <p>Follow these steps to enable AI code reviews on any GitHub repository:</p>
              
              <ol className="list-decimal pl-5 space-y-3 mt-4 text-gray-400">
                <li>Go to your GitHub repository <strong className="text-white">Settings</strong>.</li>
                <li>Click on <strong className="text-white">Webhooks</strong> in the left sidebar, then click <strong>Add webhook</strong>.</li>
                <li>
                  Set the Payload URL to your current active server URL:
                  <code className="block bg-black border border-gray-800 p-3 rounded mt-2 text-green-400 break-all">
                    https://&lt;your-ngrok-url&gt;/api/webhooks/github
                  </code>
                </li>
                <li>Set Content type to <strong className="text-white">application/json</strong>.</li>
                <li>Select <strong className="text-white">Let me select individual events</strong> and check <strong className="text-white">Pull requests</strong>.</li>
                <li>Click <strong className="text-blue-400">Add webhook</strong> to save.</li>
              </ol>
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}