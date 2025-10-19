import { useNavigate } from 'react-router-dom'
import Footer from './Footer'
import RouteCreationForm from './RouteCreationForm'
import { RouteCreationData } from '../types/route'

export default function RouteCreation() {
  const navigate = useNavigate()

  const handlePublishRoute = (
    data: RouteCreationData & { description: string; price: string },
  ) => {
    console.log('Publishing route:', data)
    // Logique de publication à implémenter
    // Après publication, rediriger vers la home
    // navigate('/')
  }

  const handleBack = () => {
    navigate(-1) // Retour à la page précédente
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Header with back button */}
      <header className="bg-background-light dark:bg-background-dark p-4 flex items-center border-b border-primary/20 dark:border-primary/30 sticky top-0 z-20">
        <button
          onClick={handleBack}
          className="text-gray-800 dark:text-white hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="flex-1 text-center text-xl font-bold text-gray-900 dark:text-white pr-8">
          Publier un itinéraire
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4">
        <div className="max-w-lg mx-auto">
          <RouteCreationForm onPublish={handlePublishRoute} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
