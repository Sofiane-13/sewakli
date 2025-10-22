import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

export interface JwtPayload {
  email: string
  iat?: number
  exp?: number
}

export interface AuthToken {
  accessToken: string
  expiresIn: number
}

/**
 * JwtTokenService handles JWT token generation and validation
 *
 * Features:
 * - Token generation with email as identifier
 * - Configurable token expiration
 * - Token validation
 */
@Injectable()
export class JwtTokenService {
  // Token expiration: 7 days
  private readonly TOKEN_EXPIRY = '7d'

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Generates a JWT token for the given email
   *
   * @param email - User's email (serves as unique identifier)
   * @returns AuthToken object with token and expiration time
   */
  generateToken(email: string): AuthToken {
    const payload: JwtPayload = { email }

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.TOKEN_EXPIRY,
    })

    return {
      accessToken,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    }
  }

  /**
   * Validates a JWT token and extracts the payload
   *
   * @param token - JWT token to validate
   * @returns JwtPayload if token is valid
   * @throws Error if token is invalid or expired
   */
  validateToken(token: string): JwtPayload {
    try {
      return this.jwtService.verify<JwtPayload>(token)
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }

  /**
   * Decodes a token without verification (use with caution)
   *
   * @param token - JWT token to decode
   * @returns JwtPayload or null if invalid
   */
  decodeToken(token: string): JwtPayload | null {
    try {
      return this.jwtService.decode(token) as JwtPayload
    } catch {
      return null
    }
  }
}
