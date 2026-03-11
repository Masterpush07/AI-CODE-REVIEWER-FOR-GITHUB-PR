"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardOverview() {
  const [profile, setProfile] = useState<any>(null)
  
  // Start with 0 while we fetch the real numbers
  const [stats, setStats] = useState({ prs: 0, bugs: 0, agents: 3 })

  useEffect(() => {
    async function fetchDashboardData() {
      const supabase = createClient()
      
      // 1. Fetch your GitHub profile
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setProfile(user.user_metadata)
      }

      // 2. Fetch the REAL data from your LangGraph backend!
      try {
        // Count total PRs reviewed
        const { count: prCount } = await supabase
          .from('review_history')
          .select('*', { count: 'exact', head: true })

        // Count how many PRs had bugs (where your Python logic evaluated to True)
        const { count: bugCount } = await supabase
          .from('review_history')
          .select('*', { count: 'exact', head: true })
          .eq('bug_found', true)

        setStats({
          prs: prCount || 0,
          bugs: bugCount || 0,
          // We leave agents at 3 because your graph.py literally has 3 worker nodes!
          agents: 3 
        })
      } catch (error) {
        console.error("Could not fetch stats:", error)
      }
    }
    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Header */}
      <div className="flex items-center gap-6">
        {profile?.avatar_url ? (
          <img 
            src={profile.avatar_url} 
            alt="GitHub Avatar" 
            className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg shadow-blue-500/20"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-gray-700 animate-pulse"></div>
        )}
        
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {profile?.name || profile?.preferred_username || "Developer"}
          </h1>
          <p className="text-gray-400">Here is what your AI agents have been up to.</p>
        </div>
      </div>

      {/* Dynamic Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900/40 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total PRs Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Now showing real database counts! */}
            <div className="text-3xl font-bold text-white">{stats.prs}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/40 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Bugs Caught</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{stats.bugs}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-900/40 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{stats.agents}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}