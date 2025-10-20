import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Footer from './Footer'
import { useSearchRoutes } from '../hooks/useSearchRoutes'
import { RouteResponse } from '../domain/ports/IRouteRepository'
import { Button } from './ui/Button'
import { Alert, AlertDescription } from './ui/Alert'

export default function SearchResults() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Récupérer les paramètres de recherche depuis l'URL
  const departureCountry = searchParams.get('departureCountry') || ''
  const departureCity = searchParams.get('departureCity') || ''
  const departureDate = searchParams.get('departureDate') || ''
  const arrivalCountry = searchParams.get('arrivalCountry') || ''
  const arrivalCity = searchParams.get('arrivalCity') || ''
  const arrivalDate = searchParams.get('arrivalDate') || ''

  // Utiliser le hook de recherche GraphQL
  const { searchRoutes, loading, error, data: routes } = useSearchRoutes()

  useEffect(() => {
    // Effectuer la recherche au chargement du composant
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
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
      <div className="flex-grow">
        {/* Header sticky */}
        <div className="bg-background-light dark:bg-background-dark sticky top-0 z-10">
          <div className="flex items-center p-3 sm:p-4 pb-2 justify-between">
            <button
              onClick={handleBack}
              className="text-neutral-900 dark:text-neutral-100"
            >
              <svg
                fill="currentColor"
                height="24px"
                viewBox="0 0 256 256"
                width="24px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
              </svg>
            </button>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 flex-1 text-center pr-6 sm:pr-8">
              Résultats de recherche
            </h2>
          </div>

          {/* Filtres de recherche appliqués */}
          {(departureCity || arrivalCity) && (
            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 break-words">
                {departureCity && (
                  <span className="font-medium">
                    De: {departureCity}, {departureCountry}
                  </span>
                )}
                {departureCity && arrivalCity && (
                  <span className="mx-2">•</span>
                )}
                {arrivalCity && (
                  <span className="font-medium">
                    À: {arrivalCity}, {arrivalCountry}
                  </span>
                )}
              </p>
              {(departureDate || arrivalDate) && (
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-1 break-words">
                  {departureDate && (
                    <span>Départ: {formatDate(departureDate)}</span>
                  )}
                  {departureDate && arrivalDate && (
                    <span className="mx-2">•</span>
                  )}
                  {arrivalDate && (
                    <span>Arrivée: {formatDate(arrivalDate)}</span>
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="px-3 sm:px-4 py-3">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-neutral-600 dark:text-neutral-300">
                Recherche en cours...
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
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Aucun itinéraire trouvé pour cette recherche
              </p>
              <Button onClick={handleBack} variant="primary">
                Nouvelle recherche
              </Button>
            </div>
          )}

          {!loading && !error && routes.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mb-3 sm:mb-4">
                {routes.length} itinéraire{routes.length > 1 ? 's' : ''} trouvé
                {routes.length > 1 ? 's' : ''}
              </p>

              {routes.map((route) => (
                <div
                  key={route.id}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 bg-white dark:bg-neutral-800 p-3 sm:p-4 rounded-xl shadow-sm sm:justify-between sm:items-center"
                >
                  <div className="flex flex-1 flex-col justify-center gap-1">
                    <p className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
                      Départ: {formatDate(route.departureDate)}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 break-words">
                      {formatRouteDescription(route)}
                    </p>
                    {route.price && (
                      <p className="text-xs sm:text-sm font-medium text-primary">
                        Prix estimé: {route.price}€
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleContactTransporter(route)}
                    variant="primary"
                    className="w-full sm:w-auto sm:min-w-[84px]"
                  >
                    Contact
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
