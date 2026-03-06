'use client'

import { useRef, forwardRef } from 'react'
import Image from 'next/image'
import DummyCover from '@/components/book/DummyCover'
import type { Book } from '@/types'

type Props = {
  books: Book[]
}

const ShareImageCanvas = forwardRef<HTMLDivElement, Props>(({ books }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: 600,
        height: 400,
        background: '#f5f0e8',
        fontFamily: '"Noto Serif JP", serif',
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <h1
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#2c2c2c',
          textAlign: 'center',
          letterSpacing: '0.1em',
          margin: 0,
        }}
      >
        私の積ん読 3 選
      </h1>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        {books.map((book) => (
          <div key={book.id} style={{ width: 140, textAlign: 'center' }}>
            <div style={{ width: 140, height: 200, overflow: 'hidden', borderRadius: 4, boxShadow: '2px 2px 8px rgba(0,0,0,0.2)' }}>
              {book.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.cover_url}
                  alt={book.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  crossOrigin="anonymous"
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#e0d8cc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
                  <span style={{ fontSize: 12, color: '#2c2c2c', lineHeight: 1.4 }}>{book.title}</span>
                </div>
              )}
            </div>
            <p style={{ fontSize: 11, color: '#2c2c2c', marginTop: 6, lineHeight: 1.3, maxWidth: 140 }}>
              {book.title.length > 20 ? book.title.slice(0, 20) + '…' : book.title}
            </p>
          </div>
        ))}
      </div>
      <p style={{ textAlign: 'right', fontSize: 12, color: '#c0392b', margin: 0 }}>
        #私の積ん読3選 #MyTsundoku
      </p>
    </div>
  )
})
ShareImageCanvas.displayName = 'ShareImageCanvas'

export default ShareImageCanvas
