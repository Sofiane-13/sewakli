import { useState } from 'react'
import CityDateField from './CityDateField'
import { IntermediateStop, RouteSearchData } from '../types/route'

interface RouteSearchFormProps {
  onSearch: (data: RouteSearchData) => void
  onProposeRoute: () => void
}

export default function RouteSearchForm({
  onSearch,
  onProposeRoute,
}: RouteSearchFormProps) {
  const [departureCountry, setDepartureCountry] = useState('')
  const [departureCity, setDepartureCity] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [arrivalCountry, setArrivalCountry] = useState('')
  const [arrivalCity, setArrivalCity] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [intermediateStops, setIntermediateStops] = useState<
    IntermediateStop[]
  >([])

  const addIntermediateStop = () => {
    const newStop: IntermediateStop = {
      id: Date.now().toString(),
      country: '',
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
    field: 'country' | 'city' | 'date',
    value: string,
  ) => {
    setIntermediateStops(
      intermediateStops.map((stop) =>
        stop.id === id ? { ...stop, [field]: value } : stop,
      ),
    )
  }

  const handleSearch = () => {
    onSearch({
      departureCountry,
      departureCity,
      departureDate,
      arrivalCountry,
      arrivalCity,
      arrivalDate,
      intermediateStops,
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg space-y-3">
      {/* Departure City and Date */}
      <CityDateField
        label="Ville de départ"
        countryValue={departureCountry}
        cityValue={departureCity}
        dateValue={departureDate}
        onCountryChange={setDepartureCountry}
        onCityChange={setDepartureCity}
        onDateChange={setDepartureDate}
        cityIcon="pin_drop"
      />

      {/* Intermediate Stops */}
      {intermediateStops.map((stop) => (
        <CityDateField
          key={stop.id}
          label="Ville intermédiaire"
          countryValue={stop.country}
          cityValue={stop.city}
          dateValue={stop.date}
          onCountryChange={(value) =>
            updateIntermediateStop(stop.id, 'country', value)
          }
          onCityChange={(value) =>
            updateIntermediateStop(stop.id, 'city', value)
          }
          onDateChange={(value) =>
            updateIntermediateStop(stop.id, 'date', value)
          }
          cityIcon="location_on"
          showRemove
          onRemove={() => removeIntermediateStop(stop.id)}
        />
      ))}

      {/* Add Intermediate Stop Button */}
      <button
        onClick={addIntermediateStop}
        type="button"
        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium py-3 rounded-lg hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">add</span>
        Ajouter une ville intermédiaire
      </button>

      {/* Arrival City and Date */}
      <CityDateField
        label="Ville d'arrivée"
        countryValue={arrivalCountry}
        cityValue={arrivalCity}
        dateValue={arrivalDate}
        onCountryChange={setArrivalCountry}
        onCityChange={setArrivalCity}
        onDateChange={setArrivalDate}
        cityIcon="flag"
      />

      {/* Search Button */}
      <button
        className="w-full bg-[#0f66bd] text-white font-semibold py-3 rounded-lg hover:bg-[#0d5ba8] transition-colors shadow-sm"
        onClick={handleSearch}
        type="button"
      >
        Search for a transporter
      </button>

      {/* Propose Route Button */}
      <button
        className="w-full bg-[#e8f2fb] text-[#0f66bd] font-semibold py-3 rounded-lg hover:bg-[#d9ebf7] transition-colors"
        onClick={onProposeRoute}
        type="button"
      >
        Propose a route
      </button>
    </div>
  )
}
