import { ApolloClient, gql } from '@apollo/client'
import { IEmailService } from '../../application/ports/IEmailService'
import { GraphQLError as GraphQLErr } from '../errors/RepositoryError'

/**
 * GraphQL Email Service Implementation
 * Implements the IEmailService interface using GraphQL
 */
export class GraphQLEmailService implements IEmailService {
  constructor(private readonly apolloClient: ApolloClient<any>) {}

  async sendVerificationCode(email: string): Promise<void> {
    try {
      const mutation = gql`
        mutation SendEmailCode($email: String!) {
          sendEmailCode(email: $email)
        }
      `

      await this.apolloClient.mutate({
        mutation,
        variables: { email },
      })
    } catch (error) {
      if (error instanceof Error) {
        throw new GraphQLErr('Failed to send verification code', error)
      }
      throw new GraphQLErr('Unknown error sending verification code')
    }
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    try {
      const mutation = gql`
        mutation VerifyEmailCode($email: String!, $code: String!) {
          verifyEmailCode(email: $email, code: $code)
        }
      `

      const result = await this.apolloClient.mutate({
        mutation,
        variables: { email, code },
      })

      return result.data?.verifyEmailCode === true
    } catch (error) {
      if (error instanceof Error) {
        throw new GraphQLErr('Failed to verify code', error)
      }
      throw new GraphQLErr('Unknown error verifying code')
    }
  }
}
