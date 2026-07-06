export function Badge({ children, variant = 'default' }) {
  const variants = {
    default:  'bg-[var(--border-soft)] text-[var(--muted)]',
    forest:   'bg-[var(--forest-light)] text-[var(--forest-dark)]',
    burgundy: 'bg-[var(--burgundy-light)] text-[var(--burgundy)]',
    gold:     'bg-[var(--gold-light)] text-[var(--gold)]',
    green:    'bg-green-50 text-green-800',
  }
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${variants[variant]}`}>
      {children}
    </span>
  )
}
