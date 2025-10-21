import { useState, useCallback } from 'react'
import { getDIContainer } from '../infrastructure/config/DIContainer'
import { SearchRoutesDTO, RouteDTO } from '../application/dtos/RouteDTO'

/**
 * Hook for searching routes
 * Thin presentation layer - delegates to use case
 */
export interface UseSearchRoutesReturn {
  searchRoutes: (criteria: SearchRoutesDTO) => Promise<void>
  routes: RouteDTO[]
  loading: boolean
  error: Error | null
}

export const useSearchRoutesNew = (): UseSearchRoutesReturn => {
  const [routes, setRoutes] = useState<RouteDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Get use case from DI container
  const searchRoutesUseCase = getDIContainer().getSearchRoutesUseCase()

  const searchRoutes = useCallback(
    async (criteria: SearchRoutesDTO): Promise<void> => {
      setLoading(true)
      setError(null)

      try {
        // Delegate to use case - no business logic here
        const results = await searchRoutesUseCase.execute(criteria)
        setRoutes(results)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        setRoutes([])
      } finally {
        setLoading(false)
      }
    },
    [searchRoutesUseCase],
  )

  return {
    searchRoutes,
    routes,
    loading,
    error,
  }
}
