interface Props {
  label: string
  value: number
  max: number
  unit: string
  color: string
}

export default function MacroBar({ label, value, max, unit, color }: Props) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  const over = value > max
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          <span className={`font-semibold ${over ? 'text-red-500' : 'text-gray-800'}`}>{value}{unit}</span>
          {' '}/ {max}{unit}
        </span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${over ? 'bg-red-400' : color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 text-right">{pct}% of goal</p>
    </div>
  )
}
