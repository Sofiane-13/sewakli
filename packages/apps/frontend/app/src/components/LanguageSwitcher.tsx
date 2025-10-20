import { useLanguage, Language } from '../contexts/LanguageContext'

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
]

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = () => {
    const currentIndex = languages.findIndex((lang) => lang.code === language)
    const nextIndex = (currentIndex + 1) % languages.length
    setLanguage(languages[nextIndex].code)
  }

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <button
      onClick={handleLanguageChange}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-600"
      aria-label="Change language"
      title="Change language"
    >
      <span className="text-base">{currentLanguage?.flag}</span>
      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
        {currentLanguage?.code.toUpperCase()}
      </span>
    </button>
  )
}
