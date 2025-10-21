import { NAVIGATION_ICONS } from '../constants/icons'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from '../hooks/useTranslation'
import { Icon } from './ui/Icon'
import { Container } from './ui/Container'
import { Divider } from './ui/Divider'

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
    <footer className="fixed bottom-0 left-0 right-0 z-sticky glass glass-border backdrop-blur-xl border-t shadow-md">
      <Container size="xl" centered>
        <div className="flex items-center justify-between py-2 sm:py-3">
          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.labelKey}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  item.isActive
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                href={item.href}
              >
                <Icon
                  name={item.icon}
                  size="sm"
                  filled={item.isFilled}
                  className="transition-transform group-hover:scale-110"
                />
                <span className="text-xs font-medium hidden sm:inline">
                  {t(item.labelKey as any)}
                </span>
              </a>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden md:inline">
              © 2025 Translink Express
            </span>
            <Divider orientation="vertical" className="h-4 hidden sm:block" />
            <LanguageSwitcher />
          </div>
        </div>
      </Container>
    </footer>
  )
}
