import { useState, useCallback, useEffect } from 'react'
import { getDIContainer } from '../infrastructure/config/DIContainer'
import { RouteDTO } from '../application/dtos/RouteDTO'

/**
 * Hook for getting all routes
 * Thin presentation layer - delegates to use case
 */
export interface UseGetAllRoutesReturn {
  routes: RouteDTO[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export const useGetAllRoutesNew = (): UseGetAllRoutesReturn => {
  const [routes, setRoutes] = useState<RouteDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Get use case from DI container
  const getAllRoutesUseCase = getDIContainer().getGetAllRoutesUseCase()

  const fetchRoutes = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    try {
      // Delegate to use case - no business logic here
      const results = await getAllRoutesUseCase.execute()
      setRoutes(results)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      setRoutes([])
    } finally {
      setLoading(false)
    }
  }, [getAllRoutesUseCase])

  // Auto-fetch on mount
  useEffect(() => {
    fetchRoutes()
  }, [fetchRoutes])

  return {
    routes,
    loading,
    error,
    refetch: fetchRoutes,
  }
}
