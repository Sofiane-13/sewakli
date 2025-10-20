import { HttpStatus } from '@nestjs/common'

/**
 * Base application exception class
 * All custom exceptions should extend this class
 */
export abstract class AppException extends Error {
  /**
   * Unique error code for client identification
   */
  abstract readonly code: string

  /**
   * HTTP status code
   */
  abstract readonly statusCode: HttpStatus

  /**
   * Optional additional context data
   */
  readonly context?: Record<string, any>

  constructor(message: string, context?: Record<string, any>) {
    super(message)
    this.name = this.constructor.name
    this.context = context
    Error.captureStackTrace(this, this.constructor)
  }

  /**
   * Convert exception to JSON response format
   */
  toJSON() {
    return {
      statusCode: this.statusCode,
      code: this.code,
      message: this.message,
      ...(this.context && { context: this.context }),
      timestamp: new Date().toISOString(),
    }
  }
}
