import { useState } from 'react'
import { RouteCreationData } from '../types/route'
import { useRouteRepository } from './useRouteRepository'
import { RouteResponse } from '../domain/ports/IRouteRepository'

interface UseCreateRouteReturn {
  createRoute: (
    data: RouteCreationData & { description: string; price: string },
    transporterId: string,
  ) => Promise<RouteResponse>
  loading: boolean
  error: Error | null
  data: RouteResponse | null
}

export const useCreateRoute = (): UseCreateRouteReturn => {
  const repository = useRouteRepository()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<RouteResponse | null>(null)

  const createRoute = async (
    routeData: RouteCreationData & { description: string; price: string },
    transporterId: string,
  ) => {
    setLoading(true)
    setError(null)

    try {
      const result = await repository.createRoute(routeData, transporterId)
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

  return {
    createRoute,
    loading,
    error,
    data,
  }
}
