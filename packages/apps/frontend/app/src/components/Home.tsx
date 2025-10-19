import Header from './Header'
import Footer from './Footer'
import RouteSearchForm from './RouteSearchForm'
import { RouteSearchData } from '../types/route'

export default function Home() {
  const handleSearchTransporter = (data: RouteSearchData) => {
    console.log('Searching for transporter:', data)
    // Logique de recherche à implémenter
  }

  const handleProposeRoute = () => {
    console.log('Proposing a route')
    // Logique de proposition de route à implémenter
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
              backgroundImage: 'url("/algeria.png")',
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
