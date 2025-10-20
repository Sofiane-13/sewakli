import { memo } from 'react'
import { COUNTRIES, getCitiesByCountry } from '../data/countries'
import { LOCATION_ICONS } from '../constants/icons'
import { PLACEHOLDERS } from '../constants/labels'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/Select'
import { Card, CardContent } from './ui/Card'

interface CityDateFieldProps {
  label: string
  countryValue: string
  cityValue: string
  dateValue: string
  onCountryChange: (value: string) => void
  onCityChange: (value: string) => void
  onDateChange: (value: string) => void
  cityIcon: string
  countryPlaceholder?: string
  cityPlaceholder?: string
  datePlaceholder?: string
  showRemove?: boolean
  onRemove?: () => void
}

function CityDateField({
  label,
  countryValue,
  cityValue,
  dateValue,
  onCountryChange,
  onCityChange,
  onDateChange,
  cityIcon,
  countryPlaceholder = PLACEHOLDERS.country,
  cityPlaceholder = PLACEHOLDERS.city,
  datePlaceholder = PLACEHOLDERS.date,
  showRemove = false,
  onRemove,
}: CityDateFieldProps) {
  const availableCities = countryValue ? getCitiesByCountry(countryValue) : []

  return (
    <Card variant="default">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </label>
        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors p-0.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            type="button"
            aria-label="Supprimer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Country Select with Radix UI */}
          <div className="relative flex-1 min-w-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10">
              {LOCATION_ICONS.country}
            </span>
            <Select value={countryValue} onValueChange={onCountryChange}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder={countryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* City Select with Radix UI */}
          <div className="relative flex-1 min-w-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10">
              {cityIcon}
            </span>
            <Select
              value={cityValue}
              onValueChange={onCityChange}
              disabled={!countryValue}
            >
              <SelectTrigger className="pl-10" disabled={!countryValue}>
                <SelectValue placeholder={cityPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {availableCities.length > 0 ? (
                  availableCities.map((city) => (
                    <SelectItem key={city.code} value={city.code}>
                      {city.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400">
                    Sélectionnez d'abord un pays
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Date Input - Keep native for now */}
          <div className="relative flex-1 min-w-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
              {LOCATION_ICONS.calendar}
            </span>
            <input
              className="w-full h-12 pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
              placeholder={datePlaceholder}
              type="date"
              value={dateValue}
              onChange={(e) => onDateChange(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default memo(CityDateField)
