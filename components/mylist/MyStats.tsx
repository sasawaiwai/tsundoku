type Props = {
  total: number
  reading: number
  finished: number
}

export default function MyStats({ total, reading, finished }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: '総登録', value: total, color: 'text-sumi' },
        { label: '積読中', value: reading, color: 'text-ake' },
        { label: '読了', value: finished, color: 'text-green-600' },
      ].map((s) => (
        <div key={s.label} className="bg-white rounded-lg p-3 text-center border border-sumi/10">
          <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          <p className="text-xs text-sumi/50 mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  )
}
