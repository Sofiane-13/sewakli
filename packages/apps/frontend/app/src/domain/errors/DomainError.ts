/**
 * Base class for all domain errors
 */
export abstract class DomainError extends Error {
  abstract readonly code: string

  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Route-specific domain errors
 */
export class InvalidRouteTransitionError extends DomainError {
  readonly code = 'INVALID_ROUTE_TRANSITION'

  constructor(from: string, to: string) {
    super(`Cannot transition route from ${from} to ${to}`)
  }
}

export class RouteNotFoundError extends DomainError {
  readonly code = 'ROUTE_NOT_FOUND'

  constructor(routeId: string) {
    super(`Route with id ${routeId} not found`)
  }
}

export class InvalidRouteDataError extends DomainError {
  readonly code = 'INVALID_ROUTE_DATA'

  constructor(message: string) {
    super(message)
  }
}

export class RouteValidationError extends DomainError {
  readonly code = 'ROUTE_VALIDATION_ERROR'

  constructor(message: string) {
    super(message)
  }
}

/**
 * Value object errors
 */
export class InvalidValueObjectError extends DomainError {
  readonly code = 'INVALID_VALUE_OBJECT'

  constructor(valueObjectName: string, message: string) {
    super(`Invalid ${valueObjectName}: ${message}`)
  }
}
