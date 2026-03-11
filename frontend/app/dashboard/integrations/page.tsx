"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [health, setHealth] = useState({
    supabase: "checking...",
    github: "checking..."
  })

  useEffect(() => {
    async function checkIntegrations() {
      try {
        const res = await fetch('/api/health')
        const data = await res.json()
        setHealth(data)
      } catch (error) {
        setHealth({ supabase: "disconnected", github: "error" })
      }
    }
    checkIntegrations()
  }, [])

  return (
    <div className="space-y-8 max-w-4xl relative">
<div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Integrations</h1>
        <p className="text-gray-400">Live system status and webhook connections.</p>
      </div>

      <div className="space-y-6">
        <Card className="bg-gray-900/40 border-gray-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight text-gray-200"> Integrations</CardTitle>
            <CardDescription className="text-gray-400">Live status of your connected services.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Supabase Integration */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-950/50">
              <div>
                <h3 className="font-medium text-white">Supabase Database</h3>
                <p className="text-sm text-gray-500">Vector memory and review history storage</p>
              </div>
              {health.supabase === "checking..." ? (
                <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20 animate-pulse">Checking...</Badge>
              ) : health.supabase === "connected" ? (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Connected</Badge>
              ) : (
                <Badge variant="destructive">Disconnected</Badge>
              )}
            </div>

            {/* GitHub Integration */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-gray-950/50">
              <div>
                <h3 className="font-medium text-white">GitHub Webhooks</h3>
                <p className="text-sm text-gray-500">Listening for pull request events</p>
              </div>
              {health.github === "checking..." ? (
                <Badge className="bg-gray-500/10 text-gray-400 border-gray-500/20 animate-pulse">Checking...</Badge>
              ) : (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}