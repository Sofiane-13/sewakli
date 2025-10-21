import { useState, useCallback } from 'react'
import { getDIContainer } from '../infrastructure/config/DIContainer'
import { CreateRouteDTO, RouteDTO } from '../application/dtos/RouteDTO'

/**
 * Hook for creating routes
 * Thin presentation layer - delegates to use case
 */
export interface UseCreateRouteReturn {
  createRoute: (data: CreateRouteDTO) => Promise<RouteDTO>
  loading: boolean
  error: Error | null
}

export const useCreateRouteNew = (): UseCreateRouteReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Get use case from DI container
  const createRouteUseCase = getDIContainer().getCreateRouteUseCase()

  const createRoute = useCallback(
    async (data: CreateRouteDTO): Promise<RouteDTO> => {
      setLoading(true)
      setError(null)

      try {
        // Delegate to use case - no business logic here
        const result = await createRouteUseCase.execute(data)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [createRouteUseCase],
  )

  return {
    createRoute,
    loading,
    error,
  }
}
