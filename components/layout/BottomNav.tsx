'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/', label: 'シェア', icon: '📤' },
  { href: '/add', label: '追加', icon: '➕' },
  { href: '/ranking', label: 'ランキング', icon: '🏆' },
  { href: '/mylist', label: 'マイリスト', icon: '📚' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-washi border-t border-sumi/20 flex">
      {tabs.map((tab) => {
        const active = pathname === tab.href
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${
              active ? 'text-ake font-bold' : 'text-sumi/50 hover:text-sumi'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
