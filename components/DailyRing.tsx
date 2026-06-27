interface Props {
  consumed: number
  goal: number
}

export default function DailyRing({ consumed, goal }: Props) {
  const size = 160
  const strokeWidth = 14
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(1, consumed / goal)
  const offset = circumference * (1 - pct)

  const color =
    pct > 1 ? '#f87171' :
    pct > 0.8 ? '#fbbf24' :
    '#16a34a'

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{Math.round(pct * 100)}%</span>
        <span className="text-xs text-gray-400">of goal</span>
      </div>
    </div>
  )
}
