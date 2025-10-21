/**
 * Base class for all application errors
 */
export abstract class ApplicationError extends Error {
  abstract readonly code: string

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Use case specific errors
 */
export class RouteCreationFailedError extends ApplicationError {
  readonly code = 'ROUTE_CREATION_FAILED'

  constructor(message: string) {
    super(message)
  }
}

export class RouteNotFoundError extends ApplicationError {
  readonly code = 'ROUTE_NOT_FOUND'

  constructor(routeId: string) {
    super(`Route with id ${routeId} not found`)
  }
}

export class EmailVerificationFailedError extends ApplicationError {
  readonly code = 'EMAIL_VERIFICATION_FAILED'

  constructor(message: string) {
    super(message)
  }
}

export class UnauthorizedError extends ApplicationError {
  readonly code = 'UNAUTHORIZED'

  constructor(message: string = 'Unauthorized access') {
    super(message)
  }
}

export class ValidationError extends ApplicationError {
  readonly code = 'VALIDATION_ERROR'

  constructor(message: string) {
    super(message)
  }
}
