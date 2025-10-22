import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Request } from 'express'
import { JwtPayload } from '../domain/JwtTokenService'

/**
 * JWT Strategy for Passport
 * Extracts JWT from cookies and validates it
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extract JWT from cookie instead of Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.auth_token
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    })
  }

  /**
   * Validate JWT payload and return user info
   * This is called after the JWT signature is verified
   */
  async validate(payload: JwtPayload) {
    return {
      email: payload.email,
    }
  }
}
