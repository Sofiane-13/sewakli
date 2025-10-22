import { AuthChecker } from 'type-graphql'
import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../domain/JwtTokenService'

interface Context {
  req: any
  res: any
}

/**
 * Custom auth checker for type-graphql
 * Validates JWT from cookie and populates req.user
 */
export const customAuthChecker: AuthChecker<Context> = ({ context }) => {
  try {
    const token = context.req?.cookies?.auth_token

    if (!token) {
      console.log('AuthChecker - No token found in cookies')
      return false
    }

    // Verify and decode the token
    const secret =
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    const decoded = verify(token, secret) as JwtPayload

    console.log('AuthChecker - Token verified, email:', decoded.email)

    // Populate req.user for use in resolvers
    context.req.user = {
      email: decoded.email,
    }

    return true
  } catch (error) {
    console.log('AuthChecker - Error:', error.message)
    return false
  }
}
