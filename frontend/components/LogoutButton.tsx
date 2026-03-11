"use client"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    // 1. Connect to Supabase
    const supabase = createClient()
    
    // 2. Securely destroy the session
    await supabase.auth.signOut()
    
    // 3. Teleport them back to the landing page
    router.push("/")
    
    // 4. Force Next.js to refresh so the Bouncer (middleware) locks the doors behind them
    router.refresh() 
  }

  return (
    <button 
      onClick={handleLogout}
      className="w-full text-left block mt-8 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-all font-medium border border-transparent hover:border-red-900/50"
    >
      🚪 Sign Out
    </button>
  )
}