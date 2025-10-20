import { HttpStatus } from '@nestjs/common'
import { AppException } from './app.exception'

/**
 * Base class for domain/business logic exceptions
 * HTTP 422 Unprocessable Entity
 */
export class DomainException extends AppException {
  readonly statusCode = HttpStatus.UNPROCESSABLE_ENTITY
  readonly code: string

  constructor(code: string, message: string, context?: Record<string, any>) {
    super(message, context)
    this.code = code
  }
}

/**
 * Entity not found exception
 * HTTP 404 Not Found
 */
export class NotFoundException extends AppException {
  readonly statusCode = HttpStatus.NOT_FOUND
  readonly code = 'NOT_FOUND'

  constructor(entityName: string, identifier: string | number) {
    super(`${entityName} with id '${identifier}' not found`, {
      entityName,
      identifier,
    })
  }
}

/**
 * Validation exception for business rules
 * HTTP 422 Unprocessable Entity
 */
export class ValidationException extends AppException {
  readonly statusCode = HttpStatus.UNPROCESSABLE_ENTITY
  readonly code = 'VALIDATION_ERROR'

  constructor(message: string, validationErrors?: Record<string, string[]>) {
    super(message, { validationErrors })
  }
}

/**
 * Invalid state transition exception
 * HTTP 422 Unprocessable Entity
 */
export class InvalidStateException extends AppException {
  readonly statusCode = HttpStatus.UNPROCESSABLE_ENTITY
  readonly code = 'INVALID_STATE'

  constructor(currentState: string, attemptedAction: string) {
    super(`Cannot ${attemptedAction} from ${currentState} state`, {
      currentState,
      attemptedAction,
    })
  }
}

/**
 * Business constraint violation exception
 * HTTP 422 Unprocessable Entity
 */
export class ConstraintViolationException extends AppException {
  readonly statusCode = HttpStatus.UNPROCESSABLE_ENTITY
  readonly code = 'CONSTRAINT_VIOLATION'

  constructor(constraint: string, message: string) {
    super(message, { constraint })
  }
}
