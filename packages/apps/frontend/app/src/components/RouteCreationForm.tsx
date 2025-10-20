import { useState } from 'react'
import CityDateField from './CityDateField'
import { RouteCreationData } from '../types/route'
import { useLocation } from '../hooks/useLocation'
import { useIntermediateStops } from '../hooks/useIntermediateStops'
import { LOCATION_ICONS } from '../constants/icons'
import { FORM_LABELS, PLACEHOLDERS } from '../constants/labels'

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
    <div className="space-y-6">
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
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          {FORM_LABELS.intermediateStops}
        </h2>
        <div className="space-y-4">
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
        <button
          onClick={addStop}
          type="button"
          className="mt-4 flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>{FORM_LABELS.addStop}</span>
        </button>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {FORM_LABELS.description}
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full bg-white/50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          placeholder={PLACEHOLDERS.description}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {FORM_LABELS.price}
        </label>
        <input
          id="price"
          type="number"
          className="w-full bg-white/50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
          placeholder={PLACEHOLDERS.price}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      {/* Publish Button */}
      <div className="pt-4">
        <button
          onClick={handlePublish}
          type="button"
          disabled={loading}
          className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
          )}
          {loading ? 'Publication en cours...' : FORM_LABELS.publishRoute}
        </button>
      </div>
    </div>
  )
}
