interface DayData { label: string; calories: number }
interface Props { data: DayData[]; goal: number }

export default function WeeklyChart({ data, goal }: Props) {
  const W = 300, H = 140
  const padX = 20, padY = 10
  const barW = (W - padX * 2) / data.length
  const maxCal = Math.max(goal * 1.2, ...data.map(d => d.calories), 1)
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short' })

  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} className="w-full" aria-label="Weekly calorie chart">
      {/* Goal line */}
      {(() => {
        const y = padY + (H - padY) * (1 - goal / maxCal)
        return (
          <>
            <line x1={padX} x2={W - padX} y1={y} y2={y} stroke="#16a34a" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />
            <text x={W - padX + 2} y={y + 4} fontSize={9} fill="#16a34a" opacity={0.7}>goal</text>
          </>
        )
      })()}
      {data.map((d, i) => {
        const barH = d.calories === 0 ? 0 : Math.max(4, (H - padY) * (d.calories / maxCal))
        const x = padX + i * barW + barW * 0.15
        const bW = barW * 0.7
        const y = padY + (H - padY) - barH
        const isToday = d.label === today
        const over = d.calories > goal
        const fill = over ? '#fca5a5' : isToday ? '#16a34a' : '#bbf7d0'
        return (
          <g key={i}>
            <rect x={x} y={y} width={bW} height={barH} rx={4} fill={fill} />
            {d.calories > 0 && (
              <text x={x + bW / 2} y={y - 3} textAnchor="middle" fontSize={8} fill="#6b7280">
                {Math.round(d.calories)}
              </text>
            )}
            <text x={x + bW / 2} y={H + padY + 14} textAnchor="middle" fontSize={10}
              fill={isToday ? '#16a34a' : '#9ca3af'} fontWeight={isToday ? 600 : 400}>
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
