export type Book = {
  id: string // ISBN
  title: string
  author: string
  publisher: string
  published_date: string
  cover_url: string | null
  total_count: number
  current_count: number
}

export type UserBook = {
  id: string
  user_id: string
  book_id: string
  added_at: string
  finished_at: string | null
  book?: Book
}

export type RankingItem = {
  book: Book
  rank: number
}
