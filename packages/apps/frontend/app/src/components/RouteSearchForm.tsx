import { useState } from 'react'
import CityDateField from './CityDateField'
import { RouteSearchData } from '../types/route'
import { useLocation } from '../hooks/useLocation'
import { LOCATION_ICONS } from '../constants/icons'
import { FORM_LABELS } from '../constants/labels'
import { Button } from './ui/Button'

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

  const handleSearch = () => {
    onSearch({
      departureCountry: departure.country,
      departureCity: departure.city,
      departureDate,
      arrivalCountry: arrival.country,
      arrivalCity: arrival.city,
      arrivalDate,
    })
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg space-y-2.5 sm:space-y-3">
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
      <Button
        variant="primary"
        className="w-full"
        onClick={handleSearch}
        type="button"
      >
        {FORM_LABELS.searchTransporter}
      </Button>

      {/* Propose Route Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={onProposeRoute}
        type="button"
      >
        {FORM_LABELS.proposeRoute}
      </Button>
    </div>
  )
}
