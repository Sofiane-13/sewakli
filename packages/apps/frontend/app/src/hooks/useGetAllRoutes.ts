import { useEffect, useState } from 'react'
import { useRouteRepository } from './useRouteRepository'
import { RouteResponse } from '../domain/ports/IRouteRepository'

interface UseGetAllRoutesReturn {
  routes: RouteResponse[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useGetAllRoutes = (fetchOnMount = true): UseGetAllRoutesReturn => {
  const repository = useRouteRepository()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [routes, setRoutes] = useState<RouteResponse[]>([])

  const fetchRoutes = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await repository.getAllRoutes()
      setRoutes(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (fetchOnMount) {
      fetchRoutes()
    }
  }, [fetchOnMount])

  return {
    routes,
    loading,
    error,
    refetch: fetchRoutes,
  }
}
