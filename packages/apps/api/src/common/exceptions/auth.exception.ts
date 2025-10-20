import { HttpStatus } from '@nestjs/common'
import { AppException } from './app.exception'

/**
 * Base authentication exception
 * HTTP 401 Unauthorized
 */
export class UnauthorizedException extends AppException {
  readonly statusCode = HttpStatus.UNAUTHORIZED
  readonly code = 'UNAUTHORIZED'

  constructor(message: string = 'Authentication required') {
    super(message)
  }
}

/**
 * Forbidden access exception
 * HTTP 403 Forbidden
 */
export class ForbiddenException extends AppException {
  readonly statusCode = HttpStatus.FORBIDDEN
  readonly code = 'FORBIDDEN'

  constructor(message: string = 'Access denied') {
    super(message)
  }
}

/**
 * Verification code not found exception
 */
export class VerificationCodeNotFoundException extends AppException {
  readonly statusCode = HttpStatus.UNAUTHORIZED
  readonly code = 'VERIFICATION_CODE_NOT_FOUND'

  constructor(email: string) {
    super('No verification code found for this email', { email })
  }
}

/**
 * Verification code expired exception
 */
export class VerificationCodeExpiredException extends AppException {
  readonly statusCode = HttpStatus.UNAUTHORIZED
  readonly code = 'VERIFICATION_CODE_EXPIRED'

  constructor() {
    super('Verification code has expired')
  }
}

/**
 * Too many verification attempts exception
 * HTTP 429 Too Many Requests
 */
export class TooManyAttemptsException extends AppException {
  readonly statusCode = HttpStatus.TOO_MANY_REQUESTS
  readonly code = 'TOO_MANY_ATTEMPTS'

  constructor(maxAttempts: number) {
    super(`Too many attempts. Please request a new code.`, { maxAttempts })
  }
}

/**
 * Invalid verification code exception
 */
export class InvalidVerificationCodeException extends AppException {
  readonly statusCode = HttpStatus.UNAUTHORIZED
  readonly code = 'INVALID_VERIFICATION_CODE'

  constructor() {
    super('Invalid verification code')
  }
}

/**
 * Email sending failed exception
 * HTTP 503 Service Unavailable
 */
export class EmailSendFailedException extends AppException {
  readonly statusCode = HttpStatus.SERVICE_UNAVAILABLE
  readonly code = 'EMAIL_SEND_FAILED'

  constructor(email: string, originalError?: Error) {
    super('Unable to send verification code', {
      email,
      originalError: originalError?.message,
    })
  }
}
