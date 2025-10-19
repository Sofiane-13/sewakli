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

export default function CityDateField({
  label,
  countryValue,
  cityValue,
  dateValue,
  onCountryChange,
  onCityChange,
  onDateChange,
  cityIcon,
  countryPlaceholder = 'Pays',
  cityPlaceholder = 'Ville',
  datePlaceholder = 'Date',
  showRemove = false,
  onRemove,
}: CityDateFieldProps) {
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
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            public
          </span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder={countryPlaceholder}
            type="text"
            value={countryValue}
            onChange={(e) => onCountryChange(e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            {cityIcon}
          </span>
          <input
            className="w-full pl-10 pr-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder={cityPlaceholder}
            type="text"
            value={cityValue}
            onChange={(e) => onCityChange(e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
            calendar_today
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
