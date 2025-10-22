import { gql } from '@apollo/client'

const SEND_EMAIL_CODE = gql`
  mutation SendEmailCode($email: String!) {
    sendEmailCode(email: $email)
  }
`

const VERIFY_EMAIL_CODE = gql`
  mutation VerifyEmailCode($email: String!, $code: String!) {
    verifyEmailCode(email: $email, code: $code) {
      accessToken
      expiresIn
      email
    }
  }
`

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

export interface AuthResponse {
  accessToken: string
  expiresIn: number
  email: string
}

export class GraphQLAuthService {
  constructor(private apolloClient: any) {}

  async sendEmailCode(email: string): Promise<boolean> {
    const result = await this.apolloClient.mutate({
      mutation: SEND_EMAIL_CODE,
      variables: { email },
    })

    return (result.data as any)?.sendEmailCode || false
  }

  async verifyEmailCode(
    email: string,
    code: string,
  ): Promise<AuthResponse | null> {
    const result = await this.apolloClient.mutate({
      mutation: VERIFY_EMAIL_CODE,
      variables: { email, code },
    })

    console.log('GraphQLAuthService - Raw result:', result)
    console.log('GraphQLAuthService - result.data:', result.data)
    console.log(
      'GraphQLAuthService - verifyEmailCode data:',
      (result.data as any)?.verifyEmailCode,
    )

    return (result.data as any)?.verifyEmailCode || null
  }

  async logout(): Promise<boolean> {
    const result = await this.apolloClient.mutate({
      mutation: LOGOUT,
    })

    return (result.data as any)?.logout || false
  }
}
