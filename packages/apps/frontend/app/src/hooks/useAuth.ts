import { useState, useEffect, useCallback } from 'react'
import { apolloClient } from '../infrastructure/graphql/apolloClient'
import { gql } from '@apollo/client'

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getCurrentUser {
      email
    }
  }
`

/**
 * Hook to check if user is authenticated
 * Checks by querying the backend which reads the httpOnly cookie
 * Does NOT store user email - only stores authentication status
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data } = await apolloClient.query({
        query: GET_CURRENT_USER,
        fetchPolicy: 'network-only', // Always fetch from network, don't use cache
      })

      const authenticated = !!data?.getCurrentUser
      console.log('[useAuth] Check result:', {
        authenticated,
        user: data?.getCurrentUser,
      })
      setIsAuthenticated(authenticated)
    } catch (error) {
      console.error('[useAuth] Check failed:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return { isAuthenticated, isLoading, refreshAuth: checkAuth }
}
