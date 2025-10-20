import { memo } from 'react'
import { COUNTRIES, getCitiesByCountry } from '../data/countries'
import { LOCATION_ICONS } from '../constants/icons'
import { PLACEHOLDERS } from '../constants/labels'

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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {showRemove && onRemove && (
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Country Select */}
        <div className="relative flex-1 min-w-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10">
            {LOCATION_ICONS.country}
          </span>
          <select
            className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
            value={countryValue}
            onChange={(e) => onCountryChange(e.target.value)}
          >
            <option value="">{countryPlaceholder}</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            expand_more
          </span>
        </div>

        {/* City Select */}
        <div className="relative flex-1 min-w-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10">
            {cityIcon}
          </span>
          <select
            className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            value={cityValue}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={!countryValue}
          >
            <option value="">{cityPlaceholder}</option>
            {availableCities.map((city) => (
              <option key={city.code} value={city.code}>
                {city.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            expand_more
          </span>
        </div>

        {/* Date Input */}
        <div className="relative flex-1 min-w-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            {LOCATION_ICONS.calendar}
          </span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
            placeholder={datePlaceholder}
            type="date"
            value={dateValue}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default memo(CityDateField)
