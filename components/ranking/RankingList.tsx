import Image from 'next/image'
import DummyCover from '@/components/book/DummyCover'
import type { RankingItem } from '@/types'

type Props = {
  items: RankingItem[]
}

const RANK_MEDALS = ['🥇', '🥈', '🥉']

export default function RankingList({ items }: Props) {
  if (items.length === 0) {
    return <p className="text-center text-sumi/50 py-12 text-sm">データがありません</p>
  }

  return (
    <ol className="space-y-2">
      {items.map((item) => (
        <li key={item.book.id} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-sumi/10">
          <span className="text-xl w-8 text-center">
            {item.rank <= 3 ? RANK_MEDALS[item.rank - 1] : item.rank}
          </span>
          <div className="w-10 h-14 flex-shrink-0 overflow-hidden rounded">
            {item.book.cover_url ? (
              <Image
                src={item.book.cover_url}
                alt={item.book.title}
                width={40}
                height={56}
                className="w-full h-full object-cover"
              />
            ) : (
              <DummyCover title={item.book.title} author={item.book.author} className="w-full h-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-sumi line-clamp-1">{item.book.title}</p>
            <p className="text-xs text-sumi/60 line-clamp-1">{item.book.author}</p>
          </div>
          <div className="text-right text-xs text-sumi/50 flex-shrink-0">
            <p className="font-bold text-sumi">{item.book.total_count}</p>
            <p>登録</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
