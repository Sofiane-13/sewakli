import { Injectable } from '@nestjs/common'
import { EmailService } from '../infrastructure/EmailService'
import {
  VerificationCodeNotFoundException,
  VerificationCodeExpiredException,
  TooManyAttemptsException,
  InvalidVerificationCodeException,
  EmailSendFailedException,
} from '../../common/exceptions'

interface VerificationCode {
  code: string
  email: string
  expiresAt: Date
  attempts: number
}

/**
 * AuthService handles email-based OTP verification
 *
 * Features:
 * - 6-digit verification codes
 * - 10-minute expiration window
 * - 3-attempt limit per code
 * - Automatic cleanup of expired codes
 *
 * @remarks
 * Currently stores codes in-memory. Consider migrating to Redis for production.
 */
@Injectable()
export class AuthService {
  private verificationCodes: Map<string, VerificationCode> = new Map()
  private readonly MAX_ATTEMPTS = 3
  private readonly CODE_EXPIRY_MINUTES = 10

  constructor(private readonly emailService: EmailService) {}

  /**
   * Generates and sends a verification code to the provided email
   *
   * @param email - The email address to send the code to
   * @returns Promise<boolean> - true if code was sent successfully
   * @throws EmailSendFailedException if email sending fails
   */
  async sendVerificationCode(email: string): Promise<boolean> {
    // Generate 6-digit code
    const code = this.generateVerificationCode()

    // Set expiration time
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + this.CODE_EXPIRY_MINUTES)

    // Store code
    this.verificationCodes.set(email, {
      code,
      email,
      expiresAt,
      attempts: 0,
    })

    // Send code via email
    try {
      await this.emailService.sendVerificationCode(
        email,
        code,
        this.CODE_EXPIRY_MINUTES,
      )
      return true
    } catch (error) {
      // Clean up stored code on send failure
      this.verificationCodes.delete(email)
      throw new EmailSendFailedException(
        email,
        error instanceof Error ? error : undefined,
      )
    }
  }

  /**
   * Verifies a code against the stored code for the email
   *
   * @param email - The email address
   * @param code - The verification code to check
   * @returns boolean - true if code is valid
   * @throws VerificationCodeNotFoundException if no code found for email
   * @throws VerificationCodeExpiredException if code has expired
   * @throws TooManyAttemptsException if max attempts exceeded
   * @throws InvalidVerificationCodeException if code doesn't match
   */
  verifyCode(email: string, code: string): boolean {
    const storedData = this.verificationCodes.get(email)

    // Check if code exists
    if (!storedData) {
      throw new VerificationCodeNotFoundException(email)
    }

    // Check expiration
    if (new Date() > storedData.expiresAt) {
      this.verificationCodes.delete(email)
      throw new VerificationCodeExpiredException()
    }

    // Check attempt limit
    if (storedData.attempts >= this.MAX_ATTEMPTS) {
      this.verificationCodes.delete(email)
      throw new TooManyAttemptsException(this.MAX_ATTEMPTS)
    }

    // Increment attempts
    storedData.attempts++

    // Verify code
    if (storedData.code !== code) {
      // Don't delete on wrong code - allow more attempts
      throw new InvalidVerificationCodeException()
    }

    // Code valid - clean up
    this.verificationCodes.delete(email)
    return true
  }

  /**
   * Cleans up expired verification codes
   * Should be called periodically (e.g., via cron job)
   */
  cleanExpiredCodes(): void {
    const now = new Date()
    for (const [email, data] of this.verificationCodes.entries()) {
      if (now > data.expiresAt) {
        this.verificationCodes.delete(email)
      }
    }
  }

  /**
   * Generates a random 6-digit verification code
   * @private
   */
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Get current number of stored codes (for monitoring)
   */
  getStoredCodesCount(): number {
    return this.verificationCodes.size
  }
}
