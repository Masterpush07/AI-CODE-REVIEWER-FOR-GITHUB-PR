"use client"
import LogoutButton from "@/components/LogoutButton"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-6 hidden md:block">
        
        {/* Logo */}
        <Link href="/" className="block mb-10 transition-transform hover:scale-105">
          <h2 className="text-xl font-extrabold tracking-wider text-white">
            THE CODE <span className="text-blue-500">AUDITOR</span>
          </h2>
        </Link>
        
        <nav className="space-y-4">
          <div className="text-xs text-gray-600 uppercase tracking-widest font-semibold mb-2">Main</div>
          
          <Link 
            href="/" 
            className="block transition-colors text-gray-400 hover:text-white"
          >
            Home
          </Link>

          <Link 
            href="/dashboard" 
            className={`block transition-colors ${pathname === '/dashboard' ? 'text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Overview
          </Link>
          
          <Link 
            href="/dashboard/repositories" 
            className={`block transition-colors ${pathname?.includes('/repositories') ? 'text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Repositories
          </Link>
          
          <Link 
            href="/dashboard/integrations" 
            className={`block transition-colors ${pathname?.includes('/integrations') ? 'text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}
          >
            Integrations
          </Link>
          {/* ADD THE LOGOUT BUTTON HERE */}
          <div className="mt-auto pt-8 border-t border-gray-800">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}