import { Container } from './ui/Container'
import { Icon } from './ui/Icon'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-sticky glass glass-border backdrop-blur-xl shadow-md">
      <Container size="xl" centered>
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 shadow-lg">
              <Icon
                name="local_shipping"
                size="lg"
                filled
                className="text-white"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-2xl font-bold text-gradient leading-tight">
                Translink Express
              </h1>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 hidden sm:block">
                Connecter transporteurs & clients
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <button
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Icon name="notifications" size="md" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-secondary-500 rounded-full ring-2 ring-white dark:ring-neutral-900" />
            </button>

            {/* User Menu */}
            <button
              className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Menu utilisateur"
            >
              <Icon name="account_circle" size="md" />
            </button>
          </div>
        </div>
      </Container>
    </header>
  )
}
