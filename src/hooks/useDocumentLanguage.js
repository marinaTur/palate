import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Keeps <html lang="..."> in sync with the active i18n language.
 * Mount once near the app root.
 */
export function useDocumentLanguage() {
  const { i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language?.startsWith('ru') ? 'ru' : 'en'
  }, [i18n.language])
}
