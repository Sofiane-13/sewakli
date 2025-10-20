import { Resolver, Mutation, Arg } from 'type-graphql'
import { AuthService } from '../../domain/AuthService'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Boolean, {
    description: 'Envoie un code de vérification par email',
  })
  async sendEmailCode(@Arg('email') email: string): Promise<boolean> {
    return await this.authService.sendVerificationCode(email)
  }

  @Mutation(() => Boolean, {
    description: "Vérifie le code email saisi par l'utilisateur",
  })
  async verifyEmailCode(
    @Arg('email') email: string,
    @Arg('code') code: string,
  ): Promise<boolean> {
    return this.authService.verifyCode(email, code)
  }
}
