export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-[var(--forest)] text-white hover:bg-[var(--forest-dark)] focus-visible:ring-[var(--forest)] active:scale-[0.98]',
    secondary: 'border border-[var(--border)] text-[var(--ink-soft)] hover:border-[var(--forest)] hover:text-[var(--forest)] bg-white',
    ghost:     'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--border-soft)]',
    burgundy:  'bg-[var(--burgundy)] text-white hover:bg-[var(--burgundy-dark)] focus-visible:ring-[var(--burgundy)]',
    gold:      'bg-[var(--gold)] text-white hover:opacity-90 focus-visible:ring-[var(--gold)]',
  }
  const sizes = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
