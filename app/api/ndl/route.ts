import { NextRequest, NextResponse } from 'next/server'

type NdlResult = {
  title: string
  author: string
  isbn: string
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')
  if (!query) return NextResponse.json([])

  // NDL Search API (旧 iss.ndl.go.jp は ndlsearch.ndl.go.jp に移転)
  // mediatype=1 は現行 API では機能しないため除外し、ISBN-13 の有無で図書を判定する
  const url = `https://ndlsearch.ndl.go.jp/api/opensearch?title=${encodeURIComponent(query)}&cnt=30`
  const res = await fetch(url, { next: { revalidate: 300 } })
  if (!res.ok) return NextResponse.json([])

  const xml = await res.text()
  const results: NdlResult[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]

    const titleMatch = block.match(/<title[^>]*>([\s\S]*?)<\/title>/)
    // dc:creator の最初の値を著者として使う
    const creatorMatch = block.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/)
    // <dc:identifier xsi:type="dcndl:ISBN">978-...</dc:identifier> を探す
    const isbnMatches = [...block.matchAll(/<dc:identifier[^>]*>([\s\S]*?)<\/dc:identifier>/g)]

    const title = titleMatch?.[1]?.trim() ?? ''
    const author = creatorMatch?.[1]?.trim() ?? ''

    // 全 identifier のうち ISBN-13（978/979 始まり13桁）を探す
    let isbn = ''
    for (const m of isbnMatches) {
      const raw = m[1].trim().replace(/-/g, '')
      if (/^97[89]\d{10}$/.test(raw)) {
        isbn = raw
        break
      }
    }

    if (title && isbn) {
      results.push({ title, author, isbn })
    }
  }

  return NextResponse.json(results)
}
