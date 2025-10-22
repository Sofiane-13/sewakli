import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * JWT Auth Guard for GraphQL (type-graphql compatible)
 * Protects GraphQL resolvers by requiring valid JWT token in cookie
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Get request from GraphQL context
   * For type-graphql, the context is directly available in args[2]
   */
  getRequest(context: ExecutionContext) {
    const args = context.getArgs()
    console.log('Guard - args length:', args?.length)
    console.log('Guard - args[2]:', args?.[2])
    console.log('Guard - args[2]?.req:', args?.[2]?.req)
    console.log('Guard - args[2]?.req?.cookies:', args?.[2]?.req?.cookies)

    // In type-graphql, context is typically the 3rd argument (args[2])
    const ctx = args[2]
    const req = ctx?.req
    console.log('Guard - returning req:', !!req)
    return req
  }

  handleRequest(err: any, user: any, info: any, context: any) {
    console.log('Guard - handleRequest called')
    console.log('Guard - err:', err)
    console.log('Guard - user:', user)
    console.log('Guard - info:', info)
    return super.handleRequest(err, user, info, context)
  }
}
