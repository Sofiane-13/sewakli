import { useNavigate } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import RouteSearchForm from './RouteSearchForm'
import { RouteSearchData } from '../types/route'
import { ROUTES, ASSETS } from '../constants/app'

export default function Home() {
  const navigate = useNavigate()

  const handleSearchTransporter = (data: RouteSearchData) => {
    // Créer les query params pour la recherche
    const params = new URLSearchParams()
    if (data.departureCountry)
      params.append('departureCountry', data.departureCountry)
    if (data.departureCity) params.append('departureCity', data.departureCity)
    if (data.departureDate) params.append('departureDate', data.departureDate)
    if (data.arrivalCountry)
      params.append('arrivalCountry', data.arrivalCountry)
    if (data.arrivalCity) params.append('arrivalCity', data.arrivalCity)
    if (data.arrivalDate) params.append('arrivalDate', data.arrivalDate)

    // Naviguer vers la page de résultats avec les query params
    navigate(`${ROUTES.searchResults}?${params.toString()}`)
  }

  const handleProposeRoute = () => {
    navigate(ROUTES.createRoute)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      <Header />

      <main className="flex-grow flex flex-col">
        <div className="relative flex-grow flex flex-col justify-end">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-black/40 bg-cover bg-center"
            style={{
              backgroundImage: `url("${ASSETS.backgrounds.home}")`,
            }}
          />

          {/* Search Form */}
          <div className="relative z-10 p-4 pb-8 -mt-4">
            <RouteSearchForm
              onSearch={handleSearchTransporter}
              onProposeRoute={handleProposeRoute}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
