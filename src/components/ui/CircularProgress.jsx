// Small ring showing "X of Y" progress for a module that's been started but
// not finished — used in Learn's directory list between the "start here"/
// "new" badge (never opened) and the "Done" badge (finished) states.
export function CircularProgress({ done, total, size = 28, stroke = 3 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = total > 0 ? done / total : 0
  const offset = circumference * (1 - progress)

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--border)" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="var(--gold)" strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-medium"
        style={{ fontSize: 9, color: 'var(--gold)' }}
      >
        {total - done}
      </span>
    </div>
  )
}
