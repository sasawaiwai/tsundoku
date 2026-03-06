'use client'

import { useState } from 'react'
import BookSearchBar from '@/components/book/BookSearchBar'
import BookSearchResults from '@/components/book/BookSearchResults'
import BarcodeScanner from '@/components/book/BarcodeScanner'
import { getBookByIsbn } from '@/lib/api/openbd'
import { addLocalBook } from '@/lib/storage'
import type { Book } from '@/types'

type SearchMode = 'title' | 'isbn'

export default function AddPage() {
  const [mode, setMode] = useState<SearchMode>('title')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [added, setAdded] = useState<string | null>(null)

  const handleTitleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setResults([])
    try {
      const { searchByTitle } = await import('@/lib/api/ndl')
      const hits = await searchByTitle(query)
      // OpenBD で書影を補完
      const books = await Promise.all(
        hits.map(async (h) => {
          const detail = await getBookByIsbn(h.isbn)
          return detail ?? {
            id: h.isbn,
            title: h.title,
            author: h.author,
            publisher: '',
            published_date: '',
            cover_url: null,
            total_count: 0,
            current_count: 0,
          }
        })
      )
      setResults(books.filter(Boolean) as Book[])
    } finally {
      setLoading(false)
    }
  }

  const handleIsbnSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const book = await getBookByIsbn(query.trim())
      setResults(book ? [book] : [])
    } finally {
      setLoading(false)
    }
  }

  const handleBarcodeScan = async (isbn: string) => {
    setShowScanner(false)
    setLoading(true)
    try {
      const book = await getBookByIsbn(isbn)
      if (book) setResults([book])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (book: Book) => {
    addLocalBook(book)
    setAdded(book.title)
    setTimeout(() => setAdded(null), 2000)
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-6 space-y-4 pb-24">
      <h1 className="text-lg font-bold text-sumi">本を追加</h1>

      {/* モード切替 */}
      <div className="flex gap-2">
        {(['title', 'isbn'] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setQuery(''); setResults([]) }}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              mode === m ? 'bg-sumi text-washi' : 'bg-sumi/10 text-sumi hover:bg-sumi/20'
            }`}
          >
            {m === 'title' ? 'タイトル検索' : 'ISBN検索'}
          </button>
        ))}
        <button
          onClick={() => setShowScanner(true)}
          className="px-3 py-1.5 rounded text-sm font-medium bg-sumi/10 text-sumi hover:bg-sumi/20 transition-colors"
        >
          📷 スキャン
        </button>
      </div>

      {/* 検索バー */}
      <BookSearchBar
        value={query}
        onChange={setQuery}
        onSearch={mode === 'title' ? handleTitleSearch : handleIsbnSearch}
        placeholder={mode === 'title' ? 'タイトルで検索…' : 'ISBNを入力…'}
        loading={loading}
      />

      {/* 追加完了トースト */}
      {added && (
        <div className="bg-green-100 text-green-700 rounded-lg p-3 text-sm text-center">
          「{added}」を積ん読リストに追加しました
        </div>
      )}

      <BookSearchResults books={results} onSelect={handleSelect} loading={loading} />

      {showScanner && (
        <BarcodeScanner onDetected={handleBarcodeScan} onClose={() => setShowScanner(false)} />
      )}
    </main>
  )
}
