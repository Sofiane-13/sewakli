import { useState } from 'react'
import CityDateField from './CityDateField'
import { RouteSearchData } from '../types/route'
import { useLocation } from '../hooks/useLocation'
import { useIntermediateStops } from '../hooks/useIntermediateStops'
import { LOCATION_ICONS } from '../constants/icons'
import { FORM_LABELS } from '../constants/labels'

interface RouteSearchFormProps {
  onSearch: (data: RouteSearchData) => void
  onProposeRoute: () => void
}

export default function RouteSearchForm({
  onSearch,
  onProposeRoute,
}: RouteSearchFormProps) {
  // Departure location
  const departure = useLocation()
  const [departureDate, setDepartureDate] = useState('')

  // Arrival location
  const arrival = useLocation()
  const [arrivalDate, setArrivalDate] = useState('')

  // Intermediate stops
  const { stops, addStop, removeStop, updateStop } = useIntermediateStops()

  const handleSearch = () => {
    onSearch({
      departureCountry: departure.country,
      departureCity: departure.city,
      departureDate,
      arrivalCountry: arrival.country,
      arrivalCity: arrival.city,
      arrivalDate,
      intermediateStops: stops,
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg space-y-3">
      {/* Departure */}
      <CityDateField
        label={FORM_LABELS.departure}
        countryValue={departure.country}
        cityValue={departure.city}
        dateValue={departureDate}
        onCountryChange={departure.handleCountryChange}
        onCityChange={departure.handleCityChange}
        onDateChange={setDepartureDate}
        cityIcon={LOCATION_ICONS.departure}
      />

      {/* Intermediate Stops */}
      {stops.map((stop) => (
        <CityDateField
          key={stop.id}
          label={FORM_LABELS.intermediate}
          countryValue={stop.country}
          cityValue={stop.city}
          dateValue={stop.date}
          onCountryChange={(value) => updateStop(stop.id, 'country', value)}
          onCityChange={(value) => updateStop(stop.id, 'city', value)}
          onDateChange={(value) => updateStop(stop.id, 'date', value)}
          cityIcon={LOCATION_ICONS.intermediate}
          showRemove
          onRemove={() => removeStop(stop.id)}
        />
      ))}

      {/* Add Intermediate Stop Button */}
      <button
        onClick={addStop}
        type="button"
        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium py-3 rounded-lg hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">add</span>
        {FORM_LABELS.addStop}
      </button>

      {/* Arrival */}
      <CityDateField
        label={FORM_LABELS.arrival}
        countryValue={arrival.country}
        cityValue={arrival.city}
        dateValue={arrivalDate}
        onCountryChange={arrival.handleCountryChange}
        onCityChange={arrival.handleCityChange}
        onDateChange={setArrivalDate}
        cityIcon={LOCATION_ICONS.arrival}
      />

      {/* Search Button */}
      <button
        className="w-full bg-[#0f66bd] text-white font-semibold py-3 rounded-lg hover:bg-[#0d5ba8] transition-colors shadow-sm"
        onClick={handleSearch}
        type="button"
      >
        {FORM_LABELS.searchTransporter}
      </button>

      {/* Propose Route Button */}
      <button
        className="w-full bg-[#e8f2fb] text-[#0f66bd] font-semibold py-3 rounded-lg hover:bg-[#d9ebf7] transition-colors"
        onClick={onProposeRoute}
        type="button"
      >
        {FORM_LABELS.proposeRoute}
      </button>
    </div>
  )
}
