import { useState, useCallback } from 'react'
import { IntermediateStop } from '../types/route'

export function useIntermediateStops() {
  const [stops, setStops] = useState<IntermediateStop[]>([])

  const addStop = useCallback(() => {
    const newStop: IntermediateStop = {
      id: Date.now().toString(),
      country: '',
      city: '',
      date: '',
    }
    setStops((prev) => [...prev, newStop])
  }, [])

  const removeStop = useCallback((id: string) => {
    setStops((prev) => prev.filter((stop) => stop.id !== id))
  }, [])

  const updateStop = useCallback(
    (id: string, field: keyof Omit<IntermediateStop, 'id'>, value: string) => {
      setStops((prev) =>
        prev.map((stop) => {
          if (stop.id === id) {
            // Reset city when country changes
            if (field === 'country') {
              return { ...stop, country: value, city: '' }
            }
            return { ...stop, [field]: value }
          }
          return stop
        }),
      )
    },
    [],
  )

  const reset = useCallback(() => {
    setStops([])
  }, [])

  return {
    stops,
    addStop,
    removeStop,
    updateStop,
    reset,
  }
}
