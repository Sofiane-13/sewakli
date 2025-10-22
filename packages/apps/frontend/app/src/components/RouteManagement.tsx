import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useRouteRepository } from '../hooks/useRouteRepository'
import { RouteResponse } from '../domain/ports/IRouteRepository'
import { useTranslation } from '../hooks/useTranslation'
import { Container } from './ui/Container'
import { Card, CardHeader, CardTitle, CardDescription } from './ui/Card'
import { Icon } from './ui/Icon'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Alert, AlertDescription } from './ui/Alert'

export default function RouteManagement() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const repository = useRouteRepository()

  const [routes, setRoutes] = useState<RouteResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setLoading(true)
        const data = await repository.getRoutesByTransporter()
        setRoutes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load routes')
      } finally {
        setLoading(false)
      }
    }

    loadRoutes()
  }, [repository])

  const handlePublish = async (routeId: string) => {
    try {
      const updated = await repository.publishRoute(routeId)
      setRoutes(routes.map((r) => (r.id === routeId ? updated : r)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish route')
    }
  }

  const handleCancel = async (routeId: string) => {
    try {
      const updated = await repository.cancelRoute(routeId)
      setRoutes(routes.map((r) => (r.id === routeId ? updated : r)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel route')
    }
  }

  const handleComplete = async (routeId: string) => {
    try {
      const updated = await repository.completeRoute(routeId)
      setRoutes(routes.map((r) => (r.id === routeId ? updated : r)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete route')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'published':
        return (
          <Badge
            variant="success"
            icon={<Icon name="check_circle" size="sm" />}
          >
            {t('published')}
          </Badge>
        )
      case 'draft':
        return (
          <Badge variant="neutral" icon={<Icon name="edit" size="sm" />}>
            Draft
          </Badge>
        )
      case 'cancelled':
        return (
          <Badge variant="error" icon={<Icon name="cancel" size="sm" />}>
            {t('cancel')}
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="primary" icon={<Icon name="done_all" size="sm" />}>
            Completed
          </Badge>
        )
      default:
        return <Badge variant="neutral">{status}</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen pt-16 sm:pt-20 pb-[60px] sm:pb-[68px]">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white py-8 sm:py-12">
        <Container size="lg" centered>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 sm:mb-6 transition-colors group"
            aria-label={t('back')}
          >
            <Icon
              name="arrow_back"
              size="md"
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">{t('back')}</span>
          </button>

          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex-shrink-0">
              <Icon name="dashboard" size="xl" filled />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-2">
                {t('manageMyRoutes')}
              </h1>
              <p className="text-white/90 text-sm sm:text-base">
                View and manage all your published routes
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-6 sm:py-12 bg-neutral-100 dark:bg-neutral-950">
        <Container size="lg" centered>
          {error && (
            <Alert variant="error" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-12">
              <Icon
                name="autorenew"
                size="xl"
                className="animate-spin text-primary-600 mx-auto mb-4"
              />
              <p className="text-neutral-600 dark:text-neutral-400">
                {t('loadingResults')}
              </p>
            </div>
          ) : routes.length === 0 ? (
            <Card variant="elevated" className="text-center py-12">
              <Icon
                name="route"
                size="xl"
                className="text-neutral-400 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                {t('noRouteFound')}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                You haven't created any routes yet
              </p>
              <Button
                onClick={() => navigate('/create-route')}
                variant="primary"
              >
                <Icon name="add" size="md" />
                {t('proposeRoute')}
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {routes.map((route) => (
                <Card key={route.id} variant="elevated" hoverable>
                  <CardHeader
                    icon={
                      <Icon
                        name="route"
                        size="lg"
                        className="text-primary-600"
                      />
                    }
                  >
                    <div className="flex items-start justify-between w-full">
                      <div>
                        <CardTitle>
                          {route.departureCity} → {route.arrivalCity}
                        </CardTitle>
                        <CardDescription>
                          {new Date(route.departureDate).toLocaleDateString()} -{' '}
                          {new Date(route.arrivalDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      {getStatusBadge(route.status)}
                    </div>
                  </CardHeader>

                  <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {t('departure')}
                        </p>
                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                          {route.departureCountry}, {route.departureCity}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {t('arrival')}
                        </p>
                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                          {route.arrivalCountry}, {route.arrivalCity}
                        </p>
                      </div>
                    </div>

                    {route.price && (
                      <div className="mb-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {t('price')}
                        </p>
                        <p className="font-bold text-primary-600">
                          €{route.price}/kg
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {route.status.toLowerCase() === 'draft' && (
                        <Button
                          onClick={() => handlePublish(route.id)}
                          variant="primary"
                          size="sm"
                        >
                          <Icon name="publish" size="sm" />
                          Publish
                        </Button>
                      )}
                      {route.status.toLowerCase() === 'published' && (
                        <>
                          <Button
                            onClick={() => handleComplete(route.id)}
                            variant="success"
                            size="sm"
                          >
                            <Icon name="check" size="sm" />
                            Complete
                          </Button>
                          <Button
                            onClick={() => handleCancel(route.id)}
                            variant="error"
                            size="sm"
                          >
                            <Icon name="cancel" size="sm" />
                            {t('cancel')}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  )
}
