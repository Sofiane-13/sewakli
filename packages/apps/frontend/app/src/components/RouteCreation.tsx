import { useNavigate } from 'react-router-dom'
import Footer from './Footer'
import RouteCreationForm from './RouteCreationForm'
import { RouteCreationData } from '../types/route'
import { useCreateRoute } from '../hooks/useCreateRoute'
import { Alert, AlertTitle, AlertDescription } from './ui/Alert'

export default function RouteCreation() {
  const navigate = useNavigate()
  const { createRoute, loading, error } = useCreateRoute()

  const handlePublishRoute = async (
    data: RouteCreationData & { description: string; price: string },
  ) => {
    try {
      // TODO: Récupérer le transporterId depuis le contexte d'authentification
      // Pour l'instant, on utilise un ID temporaire
      const transporterId = 'temp-transporter-id'

      const createdRoute = await createRoute(data, transporterId)

      // Après publication réussie, rediriger vers la page de confirmation
      navigate('/route-created', { state: { route: createdRoute } })
    } catch (err) {
      console.error('Error creating route:', err)
      // L'erreur est déjà gérée dans le hook
    }
  }

  const handleBack = () => {
    navigate(-1) // Retour à la page précédente
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Header with back button */}
      <header className="bg-white dark:bg-gray-800 px-3 py-3 sm:px-4 sm:py-4 flex items-center border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20 shadow-sm backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <button
          onClick={handleBack}
          className="text-gray-800 dark:text-white hover:text-primary transition-colors flex-shrink-0"
          aria-label="Retour"
        >
          <span className="material-symbols-outlined text-xl sm:text-2xl">
            arrow_back
          </span>
        </button>
        <h1 className="flex-1 text-center text-base sm:text-xl font-bold text-gray-900 dark:text-white pr-6 sm:pr-8 truncate">
          Publier un itinéraire
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow px-3 py-4 sm:px-4 sm:py-6">
        <div className="max-w-lg mx-auto w-full">
          {error && (
            <Alert variant="error" className="mb-4">
              <AlertTitle>Erreur lors de la création</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <RouteCreationForm onPublish={handlePublishRoute} loading={loading} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
