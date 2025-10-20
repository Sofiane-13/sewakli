import { useMemo } from 'react'
import { apolloClient } from '../infrastructure/graphql/apolloClient'
import { GraphQLAuthService } from '../infrastructure/adapters/GraphQLAuthService'

export const useAuthService = () => {
  return useMemo(() => new GraphQLAuthService(apolloClient), [])
}
