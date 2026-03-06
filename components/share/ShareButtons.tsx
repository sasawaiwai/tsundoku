'use client'

type Props = {
  onDownload: () => void
  onShareX: () => void
  generating?: boolean
}

export default function ShareButtons({ onDownload, onShareX, generating }: Props) {
  return (
    <div className="flex gap-3 justify-center flex-wrap">
      <button
        onClick={onDownload}
        disabled={generating}
        className="flex items-center gap-2 bg-sumi text-washi px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-sumi/80 transition-colors"
      >
        ⬇ 画像を保存
      </button>
      <button
        onClick={onShareX}
        disabled={generating}
        className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-black/80 transition-colors"
      >
        𝕏 でシェア
      </button>
    </div>
  )
}
