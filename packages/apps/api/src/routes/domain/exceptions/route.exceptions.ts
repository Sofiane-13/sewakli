import {
  ValidationException,
  InvalidStateException,
  NotFoundException,
} from '../../../common/exceptions'
import { RouteStatus } from '../model/Route'

/**
 * Route-specific exceptions
 */

export class RouteValidationException extends ValidationException {
  constructor(message: string, validationErrors?: Record<string, string[]>) {
    super(message, validationErrors)
  }
}

export class ArrivalBeforeDepartureException extends RouteValidationException {
  constructor() {
    super('Arrival date must be after departure date', {
      arrivalDate: ['Must be after departure date'],
    })
  }
}

export class NegativePriceException extends RouteValidationException {
  constructor(price: number) {
    super('Price cannot be negative', {
      price: [`Received ${price}, must be >= 0`],
    })
  }
}

export class InvalidIntermediateStopsOrderException extends RouteValidationException {
  constructor() {
    super(
      'Intermediate stops must be chronologically ordered between departure and arrival dates',
      {
        intermediateStops: [
          'Stops must be ordered between departure and arrival',
        ],
      },
    )
  }
}

export class RouteNotFoundException extends NotFoundException {
  constructor(routeId: string) {
    super('Route', routeId)
  }
}

export class CannotPublishRouteException extends InvalidStateException {
  constructor(currentStatus: RouteStatus) {
    super(currentStatus, 'publish route')
  }
}

export class CannotCancelRouteException extends InvalidStateException {
  constructor(currentStatus: RouteStatus) {
    super(currentStatus, 'cancel route')
  }
}

export class CannotCompleteRouteException extends InvalidStateException {
  constructor(currentStatus: RouteStatus) {
    super(currentStatus, 'complete route')
  }
}
