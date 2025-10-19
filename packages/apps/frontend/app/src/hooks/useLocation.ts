import { useState, useCallback } from 'react'

export function useLocation(initialCountry = '', initialCity = '') {
  const [country, setCountry] = useState(initialCountry)
  const [city, setCity] = useState(initialCity)

  const handleCountryChange = useCallback((newCountry: string) => {
    setCountry(newCountry)
    setCity('') // Reset city when country changes
  }, [])

  const handleCityChange = useCallback((newCity: string) => {
    setCity(newCity)
  }, [])

  const reset = useCallback(() => {
    setCountry('')
    setCity('')
  }, [])

  return {
    country,
    city,
    handleCountryChange,
    handleCityChange,
    reset,
  }
}
