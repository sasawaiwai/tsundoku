'use client'

import { useEffect, useState } from 'react'
import RankingList from '@/components/ranking/RankingList'
import type { RankingItem } from '@/types'

type Tab = 'total' | 'current' | 'finished'

const TAB_LABELS: Record<Tab, string> = {
  total: '総登録数',
  current: '積読中',
  finished: '読了数',
}

export default function RankingPage() {
  const [tab, setTab] = useState<Tab>('total')
  const [items, setItems] = useState<RankingItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // Supabase 未設定時はデモデータを表示
    // 実際は Supabase から取得する
    const demo: RankingItem[] = Array.from({ length: 10 }, (_, i) => ({
      rank: i + 1,
      book: {
        id: `demo-${i}`,
        title: ['坊っちゃん', '吾輩は猫である', 'こころ', '銀河鉄道の夜', '人間失格',
                '雪国', 'ノルウェイの森', '海辺のカフカ', '砂の女', '羅生門'][i],
        author: ['夏目漱石', '夏目漱石', '夏目漱石', '宮沢賢治', '太宰治',
                 '川端康成', '村上春樹', '村上春樹', '安部公房', '芥川龍之介'][i],
        publisher: '',
        published_date: '',
        cover_url: null,
        total_count: 100 - i * 8,
        current_count: 80 - i * 6,
      },
    }))
    setTimeout(() => {
      setItems(demo)
      setLoading(false)
    }, 500)
  }, [tab])

  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-24">
      <h1 className="text-lg font-bold text-sumi">ランキング</h1>

      {/* タブ */}
      <div className="flex gap-2">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              tab === t ? 'bg-sumi text-washi' : 'bg-sumi/10 text-sumi hover:bg-sumi/20'
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-sumi/50 py-12 text-sm">読み込み中…</p>
      ) : (
        <RankingList items={items} />
      )}
    </main>
  )
}
