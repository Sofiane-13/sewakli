import { useEffect, useState } from 'react'
import { RouteSearchData } from '../types/route'
import { useRouteRepository } from './useRouteRepository'
import { RouteResponse } from '../domain/ports/IRouteRepository'

interface UseSearchRoutesReturn {
  searchRoutes: (criteria: RouteSearchData) => Promise<RouteResponse[]>
  loading: boolean
  error: Error | null
  data: RouteResponse[]
  refetch: () => Promise<void>
}

export const useSearchRoutes = (
  initialCriteria?: RouteSearchData,
): UseSearchRoutesReturn => {
  const repository = useRouteRepository()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<RouteResponse[]>([])
  const [criteria, setCriteria] = useState<RouteSearchData | undefined>(
    initialCriteria,
  )

  const searchRoutes = async (searchCriteria: RouteSearchData) => {
    setLoading(true)
    setError(null)
    setCriteria(searchCriteria)

    try {
      const result = await repository.searchRoutes(searchCriteria)
      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refetch = async () => {
    if (criteria) {
      await searchRoutes(criteria)
    }
  }

  useEffect(() => {
    if (initialCriteria) {
      searchRoutes(initialCriteria)
    }
  }, [])

  return {
    searchRoutes,
    loading,
    error,
    data,
    refetch,
  }
}
