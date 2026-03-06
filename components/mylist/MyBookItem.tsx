'use client'

import Image from 'next/image'
import DummyCover from '@/components/book/DummyCover'
import type { UserBook } from '@/types'

type Props = {
  userBook: UserBook
  onFinish?: (bookId: string) => void
  onRemove?: (bookId: string) => void
}

export default function MyBookItem({ userBook, onFinish, onRemove }: Props) {
  const book = userBook.book
  if (!book) return null

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg p-3 border border-sumi/10">
      <div className="w-12 h-16 flex-shrink-0 overflow-hidden rounded">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            width={48}
            height={64}
            className="w-full h-full object-cover"
          />
        ) : (
          <DummyCover title={book.title} author={book.author} className="w-full h-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-sumi line-clamp-1">{book.title}</p>
        <p className="text-xs text-sumi/60 line-clamp-1">{book.author}</p>
        {userBook.finished_at ? (
          <p className="text-xs text-green-600 mt-1">
            ✓ 読了 {new Date(userBook.finished_at).toLocaleDateString('ja-JP')}
          </p>
        ) : (
          <p className="text-xs text-sumi/40 mt-1">
            積読中 {new Date(userBook.added_at).toLocaleDateString('ja-JP')}〜
          </p>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        {!userBook.finished_at && onFinish && (
          <button
            onClick={() => onFinish(book.id)}
            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded whitespace-nowrap hover:bg-green-200 transition-colors"
          >
            読了
          </button>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(book.id)}
            className="text-xs bg-sumi/10 text-sumi/50 px-2 py-1 rounded whitespace-nowrap hover:bg-sumi/20 transition-colors"
          >
            削除
          </button>
        )}
      </div>
    </div>
  )
}
