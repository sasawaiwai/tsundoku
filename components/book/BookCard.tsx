import Image from 'next/image'
import DummyCover from './DummyCover'
import type { Book } from '@/types'

type Props = {
  book: Book
  onClick?: () => void
  selected?: boolean
  className?: string
}

export default function BookCard({ book, onClick, selected, className = '' }: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all ${
        selected
          ? 'bg-ake/10 border-2 border-ake'
          : 'bg-white border border-sumi/10 hover:border-sumi/30'
      } ${className}`}
    >
      <div className="w-14 h-20 flex-shrink-0 overflow-hidden rounded">
        {book.cover_url ? (
          <Image
            src={book.cover_url}
            alt={book.title}
            width={56}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <DummyCover title={book.title} author={book.author} className="w-full h-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-sumi line-clamp-2">{book.title}</p>
        <p className="text-xs text-sumi/60 mt-1 line-clamp-1">{book.author}</p>
        <p className="text-xs text-sumi/40 mt-0.5 line-clamp-1">{book.publisher}</p>
      </div>
    </div>
  )
}
