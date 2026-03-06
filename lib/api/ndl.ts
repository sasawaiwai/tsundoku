type NdlResult = {
  title: string
  author: string
  isbn: string
}

export async function searchByTitle(query: string): Promise<NdlResult[]> {
  const res = await fetch(`/api/ndl?q=${encodeURIComponent(query)}`)
  if (!res.ok) return []
  return res.json()
}
