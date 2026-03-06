import type { Book } from '@/types'

type OpenBdResponse = {
  summary: {
    isbn: string
    title: string
    volume: string
    series: string
    publisher: string
    pubdate: string
    cover: string
    author: string
  }
} | null

export async function getBookByIsbn(isbn: string): Promise<Book | null> {
  const cleanIsbn = isbn.replace(/-/g, '')
  const res = await fetch(`https://api.openbd.jp/v1/get?isbn=${cleanIsbn}`)
  if (!res.ok) return null

  const data: OpenBdResponse[] = await res.json()
  const item = data[0]
  if (!item) return null

  const { summary } = item
  return {
    id: cleanIsbn,
    title: summary.title || '',
    author: summary.author || '',
    publisher: summary.publisher || '',
    published_date: summary.pubdate || '',
    cover_url: summary.cover || null,
    total_count: 0,
    current_count: 0,
  }
}
