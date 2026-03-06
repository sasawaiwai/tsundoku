import type { Book, UserBook } from '@/types'

const STORAGE_KEY = 'tsundoku_books'

export function getLocalBooks(): UserBook[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addLocalBook(book: Book): UserBook {
  const books = getLocalBooks()
  const existing = books.find((b) => b.book_id === book.id)
  if (existing) return existing

  const newEntry: UserBook = {
    id: crypto.randomUUID(),
    user_id: 'local',
    book_id: book.id,
    added_at: new Date().toISOString(),
    finished_at: null,
    book,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...books, newEntry]))
  return newEntry
}

export function finishLocalBook(bookId: string): void {
  const books = getLocalBooks()
  const updated = books.map((b) =>
    b.book_id === bookId && !b.finished_at
      ? { ...b, finished_at: new Date().toISOString() }
      : b
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function removeLocalBook(bookId: string): void {
  const books = getLocalBooks()
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(books.filter((b) => b.book_id !== bookId))
  )
}

export function clearLocalBooks(): void {
  localStorage.removeItem(STORAGE_KEY)
}
