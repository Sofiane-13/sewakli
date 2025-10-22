import { Field, ObjectType, Int } from 'type-graphql'

@ObjectType({ description: 'Response returned after successful email verification' })
export class AuthResponse {
  @Field(() => String, { description: 'JWT access token' })
  accessToken: string

  @Field(() => Int, { description: 'Token expiration time in seconds' })
  expiresIn: number

  @Field(() => String, { description: 'User email address' })
  email: string
}
