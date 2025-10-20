import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from './ui/Button'
import { Alert, AlertDescription } from './ui/Alert'

interface CreatedRoute {
  id: string
  departureCountry: string
  departureCity: string
  departureDate: string
  arrivalCountry: string
  arrivalCity: string
  arrivalDate: string
  intermediateStops: Array<{
    id: string
    country: string
    city: string
    date: string
  }>
  description?: string
  price?: number
  status: string
}

interface LocationState {
  route?: CreatedRoute
}

export const RouteCreationSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState
  const createdRoute = state?.route

  // Si pas de route dans l'état, rediriger vers la page d'accueil
  useEffect(() => {
    if (!createdRoute) {
      navigate('/', { replace: true })
    }
  }, [createdRoute, navigate])

  if (!createdRoute) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatPrice = (price?: number) => {
    if (!price) return 'Non spécifié'
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-5xl text-green-600 dark:text-green-400">
                check_circle
              </span>
            </div>

            {/* Success Title */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Itinéraire créé avec succès !
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Votre itinéraire a été publié et est maintenant disponible pour
              les utilisateurs
            </p>
          </div>
        </div>

        {/* Route Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined">route</span>
            Détails de l'itinéraire
          </h2>

          {/* Route ID */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Identifiant
            </p>
            <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
              {createdRoute.id}
            </p>
          </div>

          {/* Departure */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                  trip_origin
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Départ
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {createdRoute.departureCity}, {createdRoute.departureCountry}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(createdRoute.departureDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Intermediate Stops */}
          {createdRoute.intermediateStops.length > 0 && (
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 flex flex-col items-center">
                  <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <div className="flex-1 space-y-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Arrêts intermédiaires
                  </p>
                  {createdRoute.intermediateStops.map((stop, index) => (
                    <div key={stop.id} className="flex items-start gap-3 pl-0">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {stop.city}, {stop.country}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(stop.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Arrival */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                  location_on
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Arrivée
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {createdRoute.arrivalCity}, {createdRoute.arrivalCountry}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(createdRoute.arrivalDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            {/* Description */}
            {createdRoute.description && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </p>
                <p className="text-gray-900 dark:text-white">
                  {createdRoute.description}
                </p>
              </div>
            )}

            {/* Price and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Prix
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(createdRoute.price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Statut
                </p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {createdRoute.status === 'PUBLISHED'
                    ? 'Publié'
                    : createdRoute.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate('/')}
            variant="primary"
            className="flex-1"
            size="lg"
          >
            <span className="material-symbols-outlined">home</span>
            Retour à l'accueil
          </Button>

          <Button
            onClick={() => navigate('/create-route')}
            variant="secondary"
            className="flex-1"
            size="lg"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Créer un autre itinéraire
          </Button>
        </div>

        {/* Info Card */}
        <Alert variant="info" className="mt-6">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 flex-shrink-0">
              info
            </span>
            <AlertDescription>
              <strong>Prochaines étapes :</strong> Votre itinéraire est
              maintenant visible par tous les utilisateurs. Vous recevrez des
              notifications lorsque des utilisateurs manifesteront leur intérêt.
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </div>
  )
}
