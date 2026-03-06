'use client'

import { useEffect, useState, useRef } from 'react'
import FudaCard from '@/components/fuda/FudaCard'
import { getLocalBooks } from '@/lib/storage'
import type { UserBook } from '@/types'

export default function FudaPage() {
  const [books, setBooks] = useState<UserBook[]>([])
  const [selected, setSelected] = useState<UserBook | null>(null)
  const [generated, setGenerated] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setBooks(getLocalBooks().filter((b) => !b.finished_at))
  }, [])

  const handleGenerate = async () => {
    if (!selected || !cardRef.current) return
    const { default: html2canvas } = await import('html2canvas')
    const canvas = await html2canvas(cardRef.current, { useCORS: true })
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = '積ん読符.png'
    a.click()
    setGenerated(true)
    setTimeout(() => setGenerated(false), 2000)
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-24">
      <h1 className="text-lg font-bold text-sumi">符を発行する</h1>
      <p className="text-sm text-sumi/60">積ん読中の本から一冊選んで符を作れます</p>

      {books.length === 0 ? (
        <p className="text-center text-sumi/50 py-12 text-sm">積ん読が登録されていません</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {books.map((ub) => (
              <FudaCard
                key={ub.id}
                userBook={ub}
                selected={selected?.id === ub.id}
                onClick={() => setSelected(selected?.id === ub.id ? null : ub)}
              />
            ))}
          </div>

          {selected && (
            <>
              {/* 符プレビュー */}
              <div
                ref={cardRef}
                className="mx-auto"
                style={{
                  width: 240,
                  height: 400,
                  background: '#f5f0e8',
                  border: '2px solid #c0392b',
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                  fontFamily: '"Noto Serif JP", serif',
                }}
              >
                <p style={{ fontSize: 12, color: '#c0392b', letterSpacing: '0.2em', marginBottom: 16 }}>
                  積ん読符
                </p>
                <p style={{ fontSize: 14, fontWeight: 'bold', color: '#2c2c2c', textAlign: 'center', lineHeight: 1.6 }}>
                  {selected.book?.title}
                </p>
                <p style={{ fontSize: 12, color: '#666', marginTop: 12 }}>
                  {selected.book?.author}
                </p>
                <p style={{ fontSize: 10, color: '#c0392b', marginTop: 24, letterSpacing: '0.1em' }}>
                  #MyTsundoku
                </p>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full bg-ake text-white py-3 rounded-lg font-bold hover:bg-ake/80 transition-colors"
              >
                {generated ? '保存しました ✓' : '符を発行・保存する'}
              </button>
            </>
          )}
        </>
      )}
    </main>
  )
}
