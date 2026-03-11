import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation Bar */}
      <nav className="w-full border-b border-gray-800 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-10">
        <div className="font-extrabold text-xl md:text-2xl tracking-widest text-white">
          THE CODE <span className="text-blue-500">AUDITOR</span>
        </div>
        <div className="flex gap-8 text-sm font-medium text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/about" className="text-white transition-colors">About</Link>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Beyond Standard <span className="text-blue-500">Code Reviews</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            The Code Auditor isn't just a linter. It is a fully autonomous, multi-agent AI system designed to catch logic flaws, security vulnerabilities, and bad practices before they ever reach production.
          </p>
        </section>

        {/* The Architecture Grid */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold border-b border-gray-800 pb-2">The Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors">
              <h3 className="text-xl font-bold text-blue-400 mb-3">1. The Hook</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                It all starts the moment a developer opens a Pull Request. GitHub instantly fires a webhook payload to our FastAPI backend, waking up the system and initiating the pipeline.
              </p>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors">
              <h3 className="text-xl font-bold text-purple-400 mb-3">2. The Brain</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                A Logic Agent analyzes the raw code diffs while a Manager Agent cross-references the entire codebase using vector databases (RAG) to ensure the new code doesn't break existing features.
              </p>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors">
              <h3 className="text-xl font-bold text-green-400 mb-3">3. The Memory</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every bug caught and logic score calculated is permanently logged into a PostgreSQL database, creating a searchable, historical record of your repository's health.
              </p>
            </div>
            <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors">
              <h3 className="text-xl font-bold text-orange-400 mb-3">4. The Dashboard</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The results are instantly beamed to this Next.js frontend, rendering a crystal-clear, interactive Markdown report for the developer to review and action.
              </p>
            </div>
          </div>
        </section>

        {/* The Story / Creator Section */}
        <section className="bg-blue-900/10 border border-blue-900/30 p-8 rounded-2xl text-center space-y-4">
          <h2 className="text-2xl font-bold">The Mission</h2>
          <p className="text-gray-400 leading-relaxed text-sm max-w-2xl mx-auto">
            Built by PUSHPANATHAN N, this platform was created to bridge the gap between human developers and artificial intelligence. By automating the tedious, repetitive parts of code review, engineering teams can focus on what actually matters: building great software.
          </p>
          <div className="pt-6">
            <Link 
              href="/dashboard" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-bold transition-transform hover:scale-105"
            >
              Enter Dashboard →
            </Link>
          </div>
        </section>
      </main>
      
      <footer className="w-full border-t border-gray-900 py-8 text-center text-gray-600 text-sm mt-auto">
        © 2026 The Code Auditor. Built for the future.
      </footer>
    </div>
  )
}