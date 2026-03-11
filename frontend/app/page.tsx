"use client"

import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

export default function LandingPage() {
  // The magic function that triggers the secure GitHub login window
  const handleGitHubLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        // After GitHub says "yes", it sends them back to this exact URL
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const features = [
    {
      id: 1,
      title: "Multi-Agent AI",
      icon: "🤖",
      short: "A team of specialized AI agents working together.",
      detail: "Instead of one generic AI, our backend deploys specialized LangGraph agents. A Logic Agent hunts for bugs, while a Manager Agent compiles a beautiful Markdown report."
    },
    {
      id: 2,
      title: "RAG Context",
      icon: "🧠",
      short: "Understands your whole codebase, not just the PR.",
      detail: "Powered by vector databases, the AI remembers your repository's structure and coding standards, providing deep context-aware reviews."
    },
    {
      id: 3,
      title: "Real-Time Logic",
      icon: "⚡",
      short: "Instant feedback the moment you open a PR.",
      detail: "FastAPI webhooks catch GitHub events instantly. Get your code graded and bugs caught in seconds, without leaving your terminal."
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      
      {/* Navigation Bar */}
      <nav className="w-full border-b border-gray-800 p-6 flex justify-between items-center absolute top-0 z-10 bg-black/50 backdrop-blur-md">
        <div className="font-extrabold text-lg md:text-xl tracking-widest text-white">
          THE CODE <span className="text-blue-500">AUDITOR</span>
        </div>
        <div className="flex gap-8 text-sm font-medium text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Review Code at <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Light Speed
          </span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
          Automate your pull request analysis with our multi-agent AI system. 
          Catch bugs, enforce logic, and ship cleaner code faster.
        </p>
        
        <div className="flex gap-6">
          {/* This is the new authenticating button! */}
          <button 
            onClick={handleGitHubLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-md font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
          >
            Connect GitHub
          </button>
          
          <Link 
            href="/dashboard/pr/14" 
            className="bg-gray-800 hover:bg-purple-600 text-white px-8 py-4 rounded-md font-bold text-lg transition-all hover:scale-105"
          >
            View Demo
          </Link>
        </div>
      </main>

      {/* Dynamic Interactive Features Section */}
      <section id="about" className="w-full max-w-6xl mx-auto py-24 px-6 border-t border-gray-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-400">Hover over the cards to see the engine under the hood.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-gray-900/40 border border-gray-800 rounded-2xl p-8 transition-all duration-300 hover:border-blue-500/50 hover:bg-gray-800/80 cursor-pointer group h-[22rem] flex flex-col items-center pt-10 relative overflow-hidden"
            >
              {/* Icon and Title */}
              <div className="text-5xl mb-4 transform group-hover:-translate-y-4 transition-transform duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-200 transform group-hover:-translate-y-4 transition-transform duration-500">
                {feature.title}
              </h3>
              
              {/* Text Container */}
              <div className="relative w-full h-32 mt-2">
                <p className="text-gray-400 text-center transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:translate-y-4 absolute inset-0 flex items-start justify-center">
                  {feature.short}
                </p>
                <p className="text-blue-100 text-center text-sm opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-4 group-hover:translate-y-0 absolute inset-0 leading-relaxed flex items-start justify-center px-2">
                  {feature.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <footer className="w-full border-t border-gray-900 py-8 text-center text-gray-600 text-sm">
        © 2026 The Code Auditor. Built for the future.
      </footer>
    </div>
  )
}