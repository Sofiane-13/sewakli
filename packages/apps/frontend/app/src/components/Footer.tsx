import { NAVIGATION_ICONS } from '../constants/icons'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from '../hooks/useTranslation'

interface NavItem {
  icon: string
  labelKey: string
  href: string
  isActive?: boolean
  isFilled?: boolean
}

const navItems: NavItem[] = [
  {
    icon: NAVIGATION_ICONS.home,
    labelKey: 'home',
    href: '/',
    isActive: true,
    isFilled: true,
  },
]

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 z-10">
      <div className="max-w-screen-xl mx-auto">
        <nav className="flex justify-around items-center px-2 py-2 sm:py-3">
          {navItems.map((item) => (
            <a
              key={item.labelKey}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 min-w-0 px-1 ${
                item.isActive
                  ? 'text-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
              } transition-colors`}
              href={item.href}
            >
              <span
                className="material-symbols-outlined text-xl sm:text-2xl"
                style={
                  item.isFilled
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span className="text-[10px] sm:text-xs font-medium truncate max-w-full">
                {t(item.labelKey as any)}
              </span>
            </a>
          ))}
        </nav>

        {/* Language Switcher */}
        <div className="flex justify-center pb-2 px-2">
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  )
}
