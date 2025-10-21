import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import RouteCreationForm from './RouteCreationForm'
import { useTranslation } from '../hooks/useTranslation'
import { Alert, AlertTitle, AlertDescription } from './ui/Alert'
import { ROUTES, TEMP_IDS } from '../constants/app'
import { Container } from './ui/Container'
import { Card, CardHeader, CardTitle, CardDescription } from './ui/Card'
import { Icon } from './ui/Icon'
import { Badge } from './ui/Badge'
import { useCreateRouteNew } from '../hooks/useCreateRoute.new'
import { CreateRouteDTO } from '../application/dtos/RouteDTO'

/**
 * RouteCreation Component - Refactored with Clean Architecture
 *
 * Changes:
 * - Uses useCreateRouteNew hook (delegates to CreateRouteUseCase)
 * - No business logic in component (just UI state management)
 * - Uses DTOs from application layer
 * - Component is now a thin presentation layer
 */
export default function RouteCreationNew() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Use the new hook that delegates to use case
  const { createRoute, loading, error } = useCreateRouteNew()

  const handlePublishRoute = async (
    data: {
      departureCountry: string
      departureCity: string
      departureDate: string
      arrivalCountry: string
      arrivalCity: string
      arrivalDate?: string
      intermediateStops: Array<{
        country: string
        city: string
        date?: string
        order: number
      }>
      description: string
      price: string
    },
  ) => {
    try {
      // Build DTO for use case
      const createRouteDTO: CreateRouteDTO = {
        transporterId: TEMP_IDS.transporter,
        departureCountry: data.departureCountry,
        departureCity: data.departureCity,
        departureDate: data.departureDate,
        arrivalCountry: data.arrivalCountry,
        arrivalCity: data.arrivalCity,
        arrivalDate: data.arrivalDate,
        intermediateStops: data.intermediateStops,
        description: data.description,
        price: parseFloat(data.price),
        email: 'temp@email.com', // Would come from auth context
      }

      // Delegate to use case - no business logic here
      const createdRoute = await createRoute(createRouteDTO)

      // Navigate to success page with result
      navigate(ROUTES.routeCreated, {
        state: {
          route: {
            id: createdRoute.id,
            departureCountry: createdRoute.departureCountry,
            departureCity: createdRoute.departureCity,
            departureDate: createdRoute.departureDate,
            arrivalCountry: createdRoute.arrivalCountry,
            arrivalCity: createdRoute.arrivalCity,
            arrivalDate: createdRoute.arrivalDate,
            intermediateStops: createdRoute.intermediateStops.map(stop => ({
              id: `stop-${stop.order}`,
              country: stop.country,
              city: stop.city,
              date: '',
            })),
            description: createdRoute.description,
            price: createdRoute.price,
            transporterId: createdRoute.transporterId,
            status: createdRoute.status,
            createdAt: createdRoute.createdAt,
            updatedAt: createdRoute.updatedAt,
          }
        }
      })
    } catch (err) {
      // Error is already set by the hook
      console.error('Error creating route:', err)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="flex flex-col min-h-screen pt-16 sm:pt-20 pb-[60px] sm:pb-[68px]">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white py-8 sm:py-12">
        <Container size="lg" centered>
          <button
            onClick={handleBack}
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
              <Icon name="add_road" size="xl" filled />
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold mb-2">
                {t('publishRoute')}
              </h1>
              <p className="text-white/90 text-sm sm:text-base">
                {t('shareYourRoute')}
              </p>
              <div className="flex gap-2 mt-3">
                <Badge
                  variant="success"
                  className="bg-white/20 text-white border-white/30"
                  icon={<Icon name="verified" size="sm" filled />}
                >
                  {t('free')}
                </Badge>
                <Badge
                  variant="neutral"
                  className="bg-white/20 text-white border-white/30"
                  icon={<Icon name="schedule" size="sm" />}
                >
                  {t('twoMinutes')}
                </Badge>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <main className="flex-grow py-6 sm:py-12 bg-neutral-100 dark:bg-neutral-950">
        <Container size="md" centered>
          {error && (
            <Alert variant="error" className="mb-6">
              <AlertTitle>{t('errorCreatingRoute')}</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Card variant="elevated">
            <CardHeader
              icon={
                <Icon
                  name="edit_location"
                  size="lg"
                  className="text-primary-600"
                />
              }
            >
              <CardTitle>{t('routeDetails')}</CardTitle>
              <CardDescription>{t('fillRouteInfo')}</CardDescription>
            </CardHeader>

            <RouteCreationForm
              onPublish={handlePublishRoute}
              loading={loading}
            />
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
