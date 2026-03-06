'use client'

type Props = {
  value: string
  onChange: (v: string) => void
  onSearch: () => void
  placeholder?: string
  loading?: boolean
}

export default function BookSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'タイトルで検索…',
  loading,
}: Props) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder={placeholder}
        className="flex-1 border border-sumi/20 rounded px-3 py-2 text-sm bg-white text-sumi placeholder:text-sumi/30 focus:outline-none focus:border-sumi/50"
      />
      <button
        onClick={onSearch}
        disabled={loading}
        className="bg-sumi text-washi px-4 py-2 rounded text-sm font-medium disabled:opacity-50 hover:bg-sumi/80 transition-colors"
      >
        {loading ? '…' : '検索'}
      </button>
    </div>
  )
}
