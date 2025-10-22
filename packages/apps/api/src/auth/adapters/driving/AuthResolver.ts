import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  Query,
  ObjectType,
  Field,
} from 'type-graphql'
import { AuthService } from '../../domain/AuthService'
import { AuthResponse } from './dto/AuthResponse'
import { Response } from 'express'
import { verify } from 'jsonwebtoken'
import { JwtPayload } from '../../domain/JwtTokenService'

interface GraphQLContext {
  req: any
  res: Response
}

@ObjectType()
class CurrentUser {
  @Field()
  email: string
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => CurrentUser, {
    nullable: true,
    description: 'Get current authenticated user from cookie',
  })
  async getCurrentUser(
    @Ctx() context: GraphQLContext,
  ): Promise<CurrentUser | null> {
    try {
      const token = context.req?.cookies?.auth_token
      if (!token) {
        return null
      }

      const secret =
        process.env.JWT_SECRET || 'your-secret-key-change-in-production'
      const decoded = verify(token, secret) as JwtPayload

      return {
        email: decoded.email,
      }
    } catch (error) {
      return null
    }
  }

  @Mutation(() => Boolean, {
    description: 'Envoie un code de vérification par email',
  })
  async sendEmailCode(@Arg('email') email: string): Promise<boolean> {
    return await this.authService.sendVerificationCode(email)
  }

  @Mutation(() => AuthResponse, {
    description:
      'Vérifie le code email et retourne un token JWT dans un cookie',
  })
  async verifyEmailCode(
    @Arg('email') email: string,
    @Arg('code') code: string,
    @Ctx() context: GraphQLContext,
  ): Promise<AuthResponse> {
    const tokenData = this.authService.verifyCodeAndGenerateToken(email, code)

    // Set JWT token in HTTP-only cookie
    context.res.cookie('auth_token', tokenData.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',
      maxAge: tokenData.expiresIn * 1000, // Convert seconds to milliseconds
      path: '/',
    })

    return {
      accessToken: tokenData.accessToken,
      expiresIn: tokenData.expiresIn,
      email,
    }
  }

  @Mutation(() => Boolean, {
    description: 'Déconnexion - supprime le cookie auth',
  })
  async logout(@Ctx() context: GraphQLContext): Promise<boolean> {
    context.res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
    return true
  }
}
