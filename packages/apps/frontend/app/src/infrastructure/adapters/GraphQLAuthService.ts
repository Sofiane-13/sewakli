import { gql } from '@apollo/client'

const SEND_EMAIL_CODE = gql`
  mutation SendEmailCode($email: String!) {
    sendEmailCode(email: $email)
  }
`

const VERIFY_EMAIL_CODE = gql`
  mutation VerifyEmailCode($email: String!, $code: String!) {
    verifyEmailCode(email: $email, code: $code)
  }
`

export class GraphQLAuthService {
  constructor(private apolloClient: any) {}

  async sendEmailCode(email: string): Promise<boolean> {
    const result = await this.apolloClient.mutate({
      mutation: SEND_EMAIL_CODE,
      variables: { email },
    })

    return (result.data as any)?.sendEmailCode || false
  }

  async verifyEmailCode(email: string, code: string): Promise<boolean> {
    const result = await this.apolloClient.mutate({
      mutation: VERIFY_EMAIL_CODE,
      variables: { email, code },
    })

    return (result.data as any)?.verifyEmailCode || false
  }
}
