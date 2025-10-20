import { useState } from 'react'
import { useRouteRepository } from './useRouteRepository'
import { RouteResponse } from '../domain/ports/IRouteRepository'

interface UseRouteActionsReturn {
  publishRoute: (id: string) => Promise<RouteResponse>
  cancelRoute: (id: string) => Promise<RouteResponse>
  completeRoute: (id: string) => Promise<RouteResponse>
  loading: boolean
  error: Error | null
}

export const useRouteActions = (): UseRouteActionsReturn => {
  const repository = useRouteRepository()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const publishRoute = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await repository.publishRoute(id)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const cancelRoute = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await repository.cancelRoute(id)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const completeRoute = async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await repository.completeRoute(id)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    publishRoute,
    cancelRoute,
    completeRoute,
    loading,
    error,
  }
}
