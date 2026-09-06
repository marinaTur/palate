import { useTranslation } from 'react-i18next'

export function ModuleCompletionButton({ onClick, label }) {
  const { t } = useTranslation()
  const buttonText = label || t('modules.done')

  return (
    <button
      onClick={onClick}
      className="text-xs font-medium text-[var(--gold)] border border-[var(--gold)]/40 rounded-full px-3 py-1.5 hover:bg-[var(--gold)] hover:text-white transition-colors"
    >
      {buttonText}
    </button>
  )
}
