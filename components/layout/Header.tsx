'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <header className="sticky top-0 z-50 bg-washi border-b border-sumi/20 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-sumi tracking-wider">
        積ん読
      </Link>
      <div className="text-sm">
        {user ? (
          <button
            onClick={handleLogout}
            className="text-sumi/60 hover:text-sumi transition-colors"
          >
            ログアウト
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-sumi text-washi px-3 py-1.5 rounded text-xs font-medium hover:bg-sumi/80 transition-colors"
          >
            Googleでログイン
          </button>
        )}
      </div>
    </header>
  )
}
