import { useMemo } from 'react'
import { apolloClient } from '../infrastructure/graphql/apolloClient'
import { GraphQLRouteRepository } from '../infrastructure/adapters/GraphQLRouteRepository'

export const useRouteRepository = () => {
  return useMemo(() => new GraphQLRouteRepository(apolloClient), [])
}
