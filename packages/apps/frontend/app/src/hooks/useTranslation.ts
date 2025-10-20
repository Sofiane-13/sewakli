import { useLanguage } from '../contexts/LanguageContext'
import { translations, TranslationKey } from '../locales/translations'

export function useTranslation() {
  const { language } = useLanguage()

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  return { t, language }
}
