export function Card({ children, className = '', onClick, accentColor }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[var(--border)] rounded-xl p-5 ${onClick ? 'cursor-pointer hover:border-[var(--wine)] transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
