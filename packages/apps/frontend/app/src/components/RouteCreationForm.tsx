import { useState } from 'react'
import CityDateField from './CityDateField'
import { RouteCreationData } from '../types/route'
import { useLocation } from '../hooks/useLocation'
import { useIntermediateStops } from '../hooks/useIntermediateStops'
import { LOCATION_ICONS } from '../constants/icons'
import { FORM_LABELS, PLACEHOLDERS } from '../constants/labels'
import { Button } from './ui/Button'

interface RouteCreationFormProps {
  onPublish: (
    data: RouteCreationData & { description: string; price: string },
  ) => void
  loading?: boolean
}

export default function RouteCreationForm({
  onPublish,
  loading = false,
}: RouteCreationFormProps) {
  // Departure location
  const departure = useLocation()
  const [departureDate, setDepartureDate] = useState('')

  // Arrival location
  const arrival = useLocation()
  const [arrivalDate, setArrivalDate] = useState('')

  // Intermediate stops
  const { stops, addStop, removeStop, updateStop } = useIntermediateStops()

  // Additional fields
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  const handlePublish = () => {
    onPublish({
      departureCountry: departure.country,
      departureCity: departure.city,
      departureDate,
      arrivalCountry: arrival.country,
      arrivalCity: arrival.city,
      arrivalDate,
      intermediateStops: stops,
      description,
      price,
    })
  }

  return (
    <div className="space-y-4 sm:space-y-6">
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

      {/* Intermediate Stops Section */}
      <div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          {FORM_LABELS.intermediateStops}
        </h2>
        <div className="space-y-3 sm:space-y-4">
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
        </div>
        <Button
          onClick={addStop}
          type="button"
          variant="ghost"
          className="mt-3 sm:mt-4"
        >
          <span className="material-symbols-outlined text-xl sm:text-2xl">
            add_circle
          </span>
          <span>{FORM_LABELS.addStop}</span>
        </Button>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {FORM_LABELS.description}
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full bg-white/50 dark:bg-black/20 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          placeholder={PLACEHOLDERS.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {FORM_LABELS.price}
        </label>
        <input
          id="price"
          type="number"
          className="w-full bg-white/50 dark:bg-black/20 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 sm:p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          placeholder={PLACEHOLDERS.price}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* Publish Button */}
      <div className="pt-3 sm:pt-4">
        <Button
          onClick={handlePublish}
          type="button"
          variant="primary"
          className="w-full"
          isLoading={loading}
          disabled={loading}
        >
          {loading ? 'Publication en cours...' : FORM_LABELS.publishRoute}
        </Button>
      </div>
    </div>
  )
}
