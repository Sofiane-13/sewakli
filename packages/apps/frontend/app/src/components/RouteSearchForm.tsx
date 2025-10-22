import { useState } from 'react'
import CityDateField from './CityDateField'
import { RouteSearchData } from '../types/route'
import { useLocation } from '../hooks/useLocation'
import { useTranslation } from '../hooks/useTranslation'
import { LOCATION_ICONS } from '../constants/icons'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Icon } from './ui/Icon'
import { Divider } from './ui/Divider'

interface RouteSearchFormProps {
  onSearch: (data: RouteSearchData) => void
  onProposeRoute: () => void
  onManageRoutes?: () => void
}

export default function RouteSearchForm({
  onSearch,
  onProposeRoute,
  onManageRoutes,
}: RouteSearchFormProps) {
  const { t } = useTranslation()

  const departure = useLocation()
  const [departureDate, setDepartureDate] = useState('')

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
    <Card variant="glass" className="space-y-4 sm:space-y-6">
      {/* Form Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-950">
          <Icon name="search" size="lg" className="text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
            Rechercher un transporteur
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            Trouvez le transporteur idéal pour votre trajet
          </p>
        </div>
      </div>

      <Divider />

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

      {/* Swap Button */}
      <div className="flex justify-center -my-2">
        <button
          className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-primary-100 dark:hover:bg-primary-950 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all hover:scale-110"
          onClick={() => {
            const tempCountry = departure.country
            const tempCity = departure.city
            const tempDate = departureDate

            departure.handleCountryChange(arrival.country)
            departure.handleCityChange(arrival.city)
            setDepartureDate(arrivalDate)

            arrival.handleCountryChange(tempCountry)
            arrival.handleCityChange(tempCity)
            setArrivalDate(tempDate)
          }}
          type="button"
          aria-label="Inverser départ et arrivée"
        >
          <Icon name="swap_vert" size="lg" />
        </button>
      </div>

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

      <Divider />

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleSearch}
          type="button"
          leftIcon={<Icon name="search" size="md" />}
        >
          {t('searchTransporter')}
        </Button>

        <Button
          variant="outline"
          size="default"
          className="w-full"
          onClick={onProposeRoute}
          type="button"
          leftIcon={<Icon name="add_circle" size="md" />}
        >
          {t('proposeRoute')}
        </Button>

        {onManageRoutes && (
          <Button
            variant="outline"
            size="default"
            className="w-full"
            onClick={onManageRoutes}
            type="button"
            leftIcon={<Icon name="dashboard" size="md" />}
          >
            {t('manageMyRoutes')}
          </Button>
        )}
      </div>
    </Card>
  )
}
