import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
]

export function LanguageSwitcher({ className = '', dark = false }) {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('ru') ? 'ru' : 'en'

  return (
    <div className={`inline-flex items-center rounded-lg p-0.5 ${dark ? 'bg-white/10' : 'bg-[var(--forest-light)]'} ${className}`}>
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          aria-label={`Switch to ${lang.code === 'en' ? 'English' : 'Russian'}`}
          aria-pressed={current === lang.code}
          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            current === lang.code
              ? dark
                ? 'bg-white/20 text-white'
                : 'bg-white text-[var(--forest)] shadow-sm'
              : dark
                ? 'text-white/50 hover:text-white'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  )
}
