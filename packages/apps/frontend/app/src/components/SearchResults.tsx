import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useSearchRoutes } from '../hooks/useSearchRoutes'
import { RouteResponse } from '../domain/ports/IRouteRepository'
import { Button } from './ui/Button'
import { Alert, AlertDescription } from './ui/Alert'
import { Container } from './ui/Container'
import { Icon } from './ui/Icon'
import { Badge } from './ui/Badge'
import { useTranslation } from '../hooks/useTranslation'

export default function SearchResults() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const departureCountry = searchParams.get('departureCountry') || ''
  const departureCity = searchParams.get('departureCity') || ''
  const departureDate = searchParams.get('departureDate') || ''
  const arrivalCountry = searchParams.get('arrivalCountry') || ''
  const arrivalCity = searchParams.get('arrivalCity') || ''
  const arrivalDate = searchParams.get('arrivalDate') || ''

  const { searchRoutes, loading, error, data: routes } = useSearchRoutes()

  useEffect(() => {
    searchRoutes({
      departureCountry,
      departureCity,
      departureDate,
      arrivalCountry,
      arrivalCity,
      arrivalDate,
    })
  }, [
    departureCountry,
    departureCity,
    departureDate,
    arrivalCountry,
    arrivalCity,
    arrivalDate,
  ])

  const formatRouteDescription = (route: RouteResponse) => {
    const stops = [
      `${route.departureCity}, ${route.departureCountry}`,
      ...route.intermediateStops.map((stop) => `${stop.city}, ${stop.country}`),
      `${route.arrivalCity}, ${route.arrivalCountry}`,
    ]
    return stops.join(' → ')
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const handleContactTransporter = (route: RouteResponse) => {
    // TODO: Implémenter la logique de contact
    console.log('Contact transporter:', route.transporterId)
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="flex flex-col min-h-screen pt-16 sm:pt-20 pb-[60px] sm:pb-[68px]">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white py-6 sm:py-8">
        <Container size="lg" centered>
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors group"
            aria-label={t('back')}
          >
            <Icon
              name="arrow_back"
              size="md"
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">{t('back')}</span>
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon name="search" size="lg" filled />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">
                {t('searchResults')}
              </h1>
              <p className="text-white/90 text-sm">
                {routes.length} {t('foundRoutes')}
              </p>
            </div>
          </div>

          {/* Filtres appliqués */}
          {(departureCity || arrivalCity) && (
            <div className="flex flex-wrap gap-2">
              {departureCity && (
                <Badge
                  variant="neutral"
                  className="bg-white/20 text-white border-white/30"
                  icon={<Icon name="trip_origin" size="sm" />}
                >
                  {departureCity}, {departureCountry}
                </Badge>
              )}
              {arrivalCity && (
                <Badge
                  variant="neutral"
                  className="bg-white/20 text-white border-white/30"
                  icon={<Icon name="location_on" size="sm" />}
                >
                  {arrivalCity}, {arrivalCountry}
                </Badge>
              )}
              {departureDate && (
                <Badge
                  variant="neutral"
                  className="bg-white/20 text-white border-white/30"
                  icon={<Icon name="calendar_today" size="sm" />}
                >
                  {formatDate(departureDate)}
                </Badge>
              )}
            </div>
          )}
        </Container>
      </div>

      {/* Contenu principal */}
      <main className="flex-grow py-6 sm:py-8 bg-neutral-100 dark:bg-neutral-950">
        <Container size="lg" centered>
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
                <Icon
                  name="progress_activity"
                  size="lg"
                  className="animate-spin"
                />
                <span>{t('searchInProgress')}</span>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="error">
              <AlertDescription>
                {error.message || 'Une erreur est survenue'}
              </AlertDescription>
            </Alert>
          )}

          {!loading && !error && routes.length === 0 && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 text-center shadow-lg">
              <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800">
                <Icon
                  name="search_off"
                  size="xl"
                  className="text-neutral-400"
                />
              </div>
              <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                {t('noRouteFound')}
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                {t('tryModifySearch')}
              </p>
              <Button onClick={handleBack} variant="primary" size="lg">
                <Icon name="search" size="md" />
                {t('newSearch')}
              </Button>
            </div>
          )}

          {!loading && !error && routes.length > 0 && (
            <div className="space-y-4">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className="bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon
                          name="calendar_today"
                          size="sm"
                          className="text-primary-600"
                        />
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                          {t('departure')}: {formatDate(route.departureDate)}
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon
                          name="route"
                          size="sm"
                          className="text-neutral-400 mt-0.5"
                        />
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatRouteDescription(route)}
                        </p>
                      </div>
                      {route.price && (
                        <div className="flex items-center gap-2">
                          <Icon
                            name="euro"
                            size="sm"
                            className="text-success-600"
                          />
                          <p className="text-sm font-semibold text-success-600 dark:text-success-400">
                            {t('estimatedPrice')}: {route.price}€
                          </p>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleContactTransporter(route)}
                      variant="primary"
                      size="default"
                      className="w-full sm:w-auto"
                      leftIcon={<Icon name="mail" size="sm" />}
                    >
                      {t('contact')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  )
}
