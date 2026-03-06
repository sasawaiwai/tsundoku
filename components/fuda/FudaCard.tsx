import type { UserBook } from '@/types'

type Props = {
  userBook: UserBook
  selected?: boolean
  onClick?: () => void
}

export default function FudaCard({ userBook, selected, onClick }: Props) {
  const book = userBook.book
  if (!book) return null

  return (
    <div
      onClick={onClick}
      className={`border rounded-lg p-3 cursor-pointer transition-all text-center ${
        selected
          ? 'border-ake bg-ake/10'
          : 'border-sumi/20 bg-white hover:border-sumi/40'
      }`}
    >
      <div className="text-2xl mb-1">📖</div>
      <p className="text-xs font-bold text-sumi line-clamp-2">{book.title}</p>
      <p className="text-xs text-sumi/50 mt-0.5 line-clamp-1">{book.author}</p>
    </div>
  )
}
