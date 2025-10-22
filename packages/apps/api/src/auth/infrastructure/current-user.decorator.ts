import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface CurrentUserPayload {
  email: string
}

/**
 * Custom decorator to get current authenticated user from GraphQL context (type-graphql compatible)
 * Usage: @CurrentUser() user: CurrentUserPayload
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): CurrentUserPayload => {
    const args = context.getArgs()
    console.log('CurrentUser - args length:', args?.length)
    console.log('CurrentUser - args[2]?.req?.user:', args?.[2]?.req?.user)

    // In type-graphql, context is the 3rd argument (args[2])
    const ctx = args[2]
    const user = ctx?.req?.user
    console.log('CurrentUser - returning user:', user)
    return user
  },
)
