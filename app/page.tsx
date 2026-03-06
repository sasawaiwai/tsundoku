'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import DummyCover from '@/components/book/DummyCover'
import ShareImageCanvas from '@/components/share/ShareImageCanvas'
import ShareButtons from '@/components/share/ShareButtons'
import { getLocalBooks } from '@/lib/storage'
import type { Book, UserBook } from '@/types'

export default function HomePage() {
  const [myBooks, setMyBooks] = useState<UserBook[]>([])
  const [selected, setSelected] = useState<Book[]>([])
  const [generating, setGenerating] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMyBooks(getLocalBooks())
  }, [])

  const toggle = (book: Book) => {
    setSelected((prev) => {
      const exists = prev.find((b) => b.id === book.id)
      if (exists) return prev.filter((b) => b.id !== book.id)
      if (prev.length >= 3) return prev
      return [...prev, book]
    })
  }

  const handleDownload = async () => {
    if (!canvasRef.current || selected.length === 0) return
    setGenerating(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(canvasRef.current, { useCORS: true, scale: 2 })
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = '私の積ん読3選.png'
      a.click()
    } finally {
      setGenerating(false)
    }
  }

  const handleShareX = () => {
    if (selected.length === 0) return
    const titles = selected.map((b) => b.title).join('、')
    const text = `私の積ん読3選📚\n${titles}\n\n#私の積ん読3選 #MyTsundoku`
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      '_blank'
    )
  }

  const readingBooks = myBooks.filter((b) => !b.finished_at && b.book)

  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-6 pb-24">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-sumi tracking-widest">積ん読</h1>
        <p className="text-sm text-sumi/60 mt-1">3冊選んでシェアしよう</p>
      </div>

      {readingBooks.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <p className="text-sumi/50 text-sm">まだ積ん読が登録されていません</p>
          <Link
            href="/add"
            className="inline-block bg-sumi text-washi px-6 py-2.5 rounded-full text-sm font-medium hover:bg-sumi/80 transition-colors"
          >
            本を追加する
          </Link>
        </div>
      ) : (
        <>
          <div>
            <p className="text-sm text-sumi/70 mb-3">
              シェアする本を3冊選択 ({selected.length}/3)
            </p>
            <div className="space-y-2">
              {readingBooks.map((ub) => {
                const book = ub.book!
                const isSelected = selected.some((b) => b.id === book.id)
                return (
                  <div
                    key={ub.id}
                    onClick={() => toggle(book)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-ake bg-ake/10'
                        : 'border-sumi/10 bg-white hover:border-sumi/30'
                    }`}
                  >
                    <div className="w-10 h-14 flex-shrink-0 overflow-hidden rounded">
                      {book.cover_url ? (
                        <Image
                          src={book.cover_url}
                          alt={book.title}
                          width={40}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <DummyCover title={book.title} author={book.author} className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-sumi line-clamp-1">{book.title}</p>
                      <p className="text-xs text-sumi/60 line-clamp-1">{book.author}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      isSelected ? 'border-ake bg-ake' : 'border-sumi/30'
                    }`}>
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* html2canvas 用非表示 div */}
          <div style={{ position: 'absolute', left: -9999, top: 0 }}>
            <ShareImageCanvas ref={canvasRef} books={selected} />
          </div>

          {selected.length > 0 && (
            <div className="space-y-4">
              <div className="bg-washi border border-sumi/20 rounded-lg p-4">
                <p className="text-xs text-sumi/50 mb-3 text-center">プレビュー</p>
                <div className="flex gap-3 justify-center">
                  {selected.map((book) => (
                    <div key={book.id} className="text-center w-20">
                      <div className="w-20 h-28 overflow-hidden rounded shadow-sm">
                        {book.cover_url ? (
                          <Image
                            src={book.cover_url}
                            alt={book.title}
                            width={80}
                            height={112}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <DummyCover title={book.title} author={book.author} className="w-full h-full" />
                        )}
                      </div>
                      <p className="text-xs text-sumi mt-1 line-clamp-2">{book.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <ShareButtons onDownload={handleDownload} onShareX={handleShareX} generating={generating} />
            </div>
          )}
        </>
      )}
    </main>
  )
}
