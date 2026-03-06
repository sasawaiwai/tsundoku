import BookCard from './BookCard'
import type { Book } from '@/types'

type Props = {
  books: Book[]
  onSelect: (book: Book) => void
  loading?: boolean
}

export default function BookSearchResults({ books, onSelect, loading }: Props) {
  if (loading) {
    return <p className="text-center text-sumi/50 py-8 text-sm">検索中…</p>
  }

  if (books.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onClick={() => onSelect(book)} />
      ))}
    </div>
  )
}
