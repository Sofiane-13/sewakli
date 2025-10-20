import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Footer from './Footer'
import { useSearchRoutes } from '../hooks/useSearchRoutes'
import { RouteResponse } from '../domain/ports/IRouteRepository'

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
          <div className="flex items-center p-4 pb-2 justify-between">
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
            <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex-1 text-center pr-6">
              Résultats de recherche
            </h2>
          </div>

          {/* Filtres de recherche appliqués */}
          {(departureCity || arrivalCity) && (
            <div className="px-4 py-3 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <p className="text-sm text-neutral-600 dark:text-neutral-300">
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
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
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
        <div className="px-4 py-3">
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-neutral-600 dark:text-neutral-300">
                Recherche en cours...
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-800 dark:text-red-200">
              {error.message || 'Une erreur est survenue'}
            </div>
          )}

          {!loading && !error && routes.length === 0 && (
            <div className="bg-white dark:bg-neutral-800 rounded-xl p-8 text-center">
              <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                Aucun itinéraire trouvé pour cette recherche
              </p>
              <button
                onClick={handleBack}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Nouvelle recherche
              </button>
            </div>
          )}

          {!loading && !error && routes.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">
                {routes.length} itinéraire{routes.length > 1 ? 's' : ''} trouvé
                {routes.length > 1 ? 's' : ''}
              </p>

              {routes.map((route) => (
                <div
                  key={route.id}
                  className="flex gap-4 bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm justify-between items-center"
                >
                  <div className="flex flex-1 flex-col justify-center gap-1">
                    <p className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                      Départ: {formatDate(route.departureDate)}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">
                      {formatRouteDescription(route)}
                    </p>
                    {route.price && (
                      <p className="text-sm font-medium text-primary">
                        Prix estimé: {route.price}€
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleContactTransporter(route)}
                    className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg px-4 bg-primary text-white text-sm font-medium w-fit hover:bg-primary/90 transition-colors"
                  >
                    <span>Contact</span>
                  </button>
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
