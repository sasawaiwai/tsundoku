'use client'

import { useEffect, useState } from 'react'
import MyBookItem from '@/components/mylist/MyBookItem'
import MyStats from '@/components/mylist/MyStats'
import { getLocalBooks, finishLocalBook, removeLocalBook } from '@/lib/storage'
import type { UserBook } from '@/types'

type Tab = 'reading' | 'finished'

export default function MyListPage() {
  const [books, setBooks] = useState<UserBook[]>([])
  const [tab, setTab] = useState<Tab>('reading')

  const reload = () => setBooks(getLocalBooks())

  useEffect(() => { reload() }, [])

  const handleFinish = (bookId: string) => {
    finishLocalBook(bookId)
    reload()
  }

  const handleRemove = (bookId: string) => {
    removeLocalBook(bookId)
    reload()
  }

  const reading = books.filter((b) => !b.finished_at)
  const finished = books.filter((b) => !!b.finished_at)
  const displayed = tab === 'reading' ? reading : finished

  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-24">
      <h1 className="text-lg font-bold text-sumi">マイリスト</h1>

      <MyStats total={books.length} reading={reading.length} finished={finished.length} />

      {/* タブ */}
      <div className="flex gap-2">
        {(['reading', 'finished'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              tab === t ? 'bg-sumi text-washi' : 'bg-sumi/10 text-sumi hover:bg-sumi/20'
            }`}
          >
            {t === 'reading' ? `積読中 (${reading.length})` : `読了 (${finished.length})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {displayed.length === 0 ? (
          <p className="text-center text-sumi/50 py-12 text-sm">
            {tab === 'reading' ? '積ん読が登録されていません' : '読了本がありません'}
          </p>
        ) : (
          displayed.map((ub) => (
            <MyBookItem
              key={ub.id}
              userBook={ub}
              onFinish={tab === 'reading' ? handleFinish : undefined}
              onRemove={handleRemove}
            />
          ))
        )}
      </div>
    </main>
  )
}
