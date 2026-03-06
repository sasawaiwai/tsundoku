type Props = {
  title: string
  author: string
  className?: string
}

export default function DummyCover({ title, author, className = '' }: Props) {
  return (
    <div
      className={`bg-sumi/10 flex flex-col items-center justify-center text-center p-2 ${className}`}
    >
      <p className="text-sumi text-xs font-bold leading-tight line-clamp-4">{title}</p>
      <p className="text-sumi/60 text-xs mt-1 line-clamp-2">{author}</p>
    </div>
  )
}
