import { NAVIGATION_ICONS } from '../constants/icons'

interface NavItem {
  icon: string
  label: string
  href: string
  isActive?: boolean
  isFilled?: boolean
}

const navItems: NavItem[] = [
  {
    icon: NAVIGATION_ICONS.home,
    label: 'Home',
    href: '#',
    isActive: true,
    isFilled: true,
  },
  { icon: NAVIGATION_ICONS.routes, label: 'Routes', href: '#' },
  { icon: NAVIGATION_ICONS.messages, label: 'Messages', href: '#' },
  { icon: NAVIGATION_ICONS.profile, label: 'Profile', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 z-10">
      <nav className="flex justify-around items-center px-2 py-2">
        {navItems.map((item) => (
          <a
            key={item.label}
            className={`flex flex-col items-center gap-1 ${
              item.isActive
                ? 'text-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
            } transition-colors`}
            href={item.href}
          >
            <span
              className="material-symbols-outlined"
              style={
                item.isFilled
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {item.icon}
            </span>
            <span className="text-xs font-medium">{item.label}</span>
          </a>
        ))}
      </nav>
    </footer>
  )
}
