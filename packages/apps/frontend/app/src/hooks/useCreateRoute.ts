import { RouteCreationData } from '../types/route'
import { useRouteRepository } from './useRouteRepository'
import { RouteResponse } from '../domain/ports/IRouteRepository'
import { useAsync, UseAsyncReturn } from './useAsync'
import { useCallback } from 'react'

type CreateRouteData = RouteCreationData & {
  description: string
  price: string
}

interface UseCreateRouteReturn
  extends Omit<
    UseAsyncReturn<RouteResponse, [CreateRouteData, string]>,
    'execute'
  > {
  createRoute: (
    data: CreateRouteData,
    transporterId: string,
  ) => Promise<RouteResponse>
}

/**
 * Hook for creating a new route
 * @returns Object with createRoute function and async state (loading, error, data)
 */
export const useCreateRoute = (): UseCreateRouteReturn => {
  const repository = useRouteRepository()

  const asyncCreateRoute = useCallback(
    (routeData: CreateRouteData, transporterId: string) => {
      return repository.createRoute(routeData, transporterId)
    },
    [repository],
  )

  const { execute, ...state } = useAsync(asyncCreateRoute)

  return {
    createRoute: execute,
    ...state,
  }
}
