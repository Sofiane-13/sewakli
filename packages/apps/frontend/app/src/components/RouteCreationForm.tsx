import { useState } from 'react'
import CityDateField from './CityDateField'
import EmailVerification from './EmailVerification'
import { RouteCreationData } from '../types/route'
import { useLocation } from '../hooks/useLocation'
import { useIntermediateStops } from '../hooks/useIntermediateStops'
import { useTranslation } from '../hooks/useTranslation'
import { useAuth } from '../hooks/useAuth'
import { LOCATION_ICONS } from '../constants/icons'
import { Button } from './ui/Button'
import { validateEmail } from '../lib/validation'

interface RouteCreationFormProps {
  onPublish: (
    data: RouteCreationData & {
      description: string
      price: string
      email: string
    },
  ) => void
  loading?: boolean
}

export default function RouteCreationForm({
  onPublish,
  loading = false,
}: RouteCreationFormProps) {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading: isCheckingAuth, refreshAuth } = useAuth()

  console.log('[RouteCreationForm] Auth state:', {
    isAuthenticated,
    isCheckingAuth,
  })

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
  const [email, setEmail] = useState('')

  // Email verification state
  const [showVerificationModal, setShowVerificationModal] = useState(false)

  const handleEmailVerified = () => {
    setShowVerificationModal(false)

    // Refresh auth state to detect the new cookie
    refreshAuth()

    // Once email is verified, cookie is set by backend, create the route
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
      email,
    })
  }

  const handleCloseModal = () => {
    setShowVerificationModal(false)
  }

  const handlePublish = () => {
    // If already authenticated (has cookie), publish directly
    if (isAuthenticated) {
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
        email: '', // Email not needed - it's in the cookie
      })
      return
    }

    // For non-authenticated users, validate email and trigger verification
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      alert(emailValidation.error || 'Please enter a valid email')
      return
    }

    // Trigger email verification - this will set the cookie
    setShowVerificationModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Departure */}
      <CityDateField
        label={t('departure')}
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
        label={t('arrival')}
        countryValue={arrival.country}
        cityValue={arrival.city}
        dateValue={arrivalDate}
        onCountryChange={arrival.handleCountryChange}
        onCityChange={arrival.handleCityChange}
        onDateChange={setArrivalDate}
        cityIcon={LOCATION_ICONS.arrival}
      />

      {/* Intermediate Stops Section */}
      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
        <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">pin_drop</span>
          {t('intermediateStops')}
        </h2>
        <div className="space-y-4">
          {stops.map((stop) => (
            <CityDateField
              key={stop.id}
              label={t('intermediate')}
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
          size="sm"
          className="mt-4"
          leftIcon={
            <span className="material-symbols-outlined text-lg">
              add_circle
            </span>
          }
        >
          {t('addStop')}
        </Button>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
        >
          {t('description')}
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-600 border border-neutral-300 dark:border-neutral-700 rounded-xl p-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
          placeholder={t('descriptionPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Price */}
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
        >
          {t('price')}
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 font-semibold">
            €
          </span>
          <input
            id="price"
            type="number"
            className="w-full h-12 pl-10 pr-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-600 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            placeholder={t('pricePlaceholder')}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Email Field - Hidden when authenticated or checking auth */}
      {!isCheckingAuth && !isAuthenticated && (
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            {t('email')}
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
              mail
            </span>
            <input
              id="email"
              type="email"
              className="w-full h-12 pl-12 pr-4 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-600 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 flex items-start gap-1">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>{t('emailVerificationInfo')}</span>
          </p>
        </div>
      )}

      {/* Publish Button */}
      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <Button
          onClick={handlePublish}
          type="button"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={loading}
          disabled={loading}
          leftIcon={
            !loading ? (
              <span className="material-symbols-outlined">publish</span>
            ) : undefined
          }
        >
          {loading ? t('publishing') : t('publishButton')}
        </Button>
      </div>

      {/* Email Verification Modal */}
      {showVerificationModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <EmailVerification
              onVerified={handleEmailVerified}
              loading={loading}
              initialEmail={email}
            />
          </div>
        </div>
      )}
    </div>
  )
}
