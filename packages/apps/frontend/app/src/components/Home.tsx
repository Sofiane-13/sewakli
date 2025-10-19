import { useState } from 'react'

interface IntermediateStop {
  id: string
  city: string
  date: string
}

export default function Home() {
  const [departureCity, setDepartureCity] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [arrivalCity, setArrivalCity] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [intermediateStops, setIntermediateStops] = useState<
    IntermediateStop[]
  >([])

  const addIntermediateStop = () => {
    const newStop: IntermediateStop = {
      id: Date.now().toString(),
      city: '',
      date: '',
    }
    setIntermediateStops([...intermediateStops, newStop])
  }

  const removeIntermediateStop = (id: string) => {
    setIntermediateStops(intermediateStops.filter((stop) => stop.id !== id))
  }

  const updateIntermediateStop = (
    id: string,
    field: 'city' | 'date',
    value: string,
  ) => {
    setIntermediateStops(
      intermediateStops.map((stop) =>
        stop.id === id ? { ...stop, [field]: value } : stop,
      ),
    )
  }

  const handleSearchTransporter = () => {
    console.log('Searching for transporter:', {
      departureCity,
      departureDate,
      arrivalCity,
      arrivalDate,
      intermediateStops,
    })
    // Logique de recherche à implémenter
  }

  const handleProposeRoute = () => {
    console.log('Proposing a route')
    // Logique de proposition de route à implémenter
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <header className="bg-background-light dark:bg-background-dark p-4 flex justify-between items-center sticky top-0 z-20 shadow-sm">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white text-center flex-1">
          Translink Express
        </h1>
        <button className="text-gray-900 dark:text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        <div className="relative flex-grow flex flex-col justify-end">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-black/40 bg-cover bg-center"
            style={{
              backgroundImage: 'url("/algeria.png")',
            }}
          ></div>

          {/* Search Form */}
          <div className="relative z-10 p-4 pb-8 -mt-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg space-y-3">
              {/* Departure City and Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ville de départ
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      pin_drop
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="Ville"
                      type="text"
                      value={departureCity}
                      onChange={(e) => setDepartureCity(e.target.value)}
                    />
                  </div>
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      calendar_today
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                      placeholder="Date"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Intermediate Stops */}
              {intermediateStops.map((stop) => (
                <div key={stop.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ville intermédiaire
                    </label>
                    <button
                      onClick={() => removeIntermediateStop(stop.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <span className="material-symbols-outlined text-xl">
                        close
                      </span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        location_on
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="Ville"
                        type="text"
                        value={stop.city}
                        onChange={(e) =>
                          updateIntermediateStop(
                            stop.id,
                            'city',
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        calendar_today
                      </span>
                      <input
                        className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                        placeholder="Date"
                        type="date"
                        value={stop.date}
                        onChange={(e) =>
                          updateIntermediateStop(
                            stop.id,
                            'date',
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Intermediate Stop Button */}
              <button
                onClick={addIntermediateStop}
                className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium py-3 rounded-lg hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Ajouter une ville intermédiaire
              </button>

              {/* Arrival City and Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ville d'arrivée
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      flag
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      placeholder="Ville"
                      type="text"
                      value={arrivalCity}
                      onChange={(e) => setArrivalCity(e.target.value)}
                    />
                  </div>
                  <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                      calendar_today
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                      placeholder="Date"
                      type="date"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                className="w-full bg-[#0f66bd] text-white font-semibold py-3 rounded-lg hover:bg-[#0d5ba8] transition-colors shadow-sm"
                onClick={handleSearchTransporter}
              >
                Search for a transporter
              </button>

              {/* Propose Route Button */}
              <button
                className="w-full bg-[#e8f2fb] text-[#0f66bd] font-semibold py-3 rounded-lg hover:bg-[#d9ebf7] transition-colors"
                onClick={handleProposeRoute}
              >
                Propose a route
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 z-10">
        <nav className="flex justify-around items-center px-2 py-2">
          <a className="flex flex-col items-center gap-1 text-primary" href="#">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              home
            </span>
            <span className="text-xs font-medium">Home</span>
          </a>
        </nav>
      </footer>
    </div>
  )
}
