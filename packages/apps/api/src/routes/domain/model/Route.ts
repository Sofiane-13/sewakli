import { randomUUID } from 'crypto'
import { CreateIntermediateStop, IntermediateStop } from './IntermediateStop'
import { RouteErrors } from '../errors/RouteErrors'

export enum RouteStatus {
  CREATED = 'CREATED',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface CreateRoute {
  departureCountry: string
  departureCity: string
  departureDate: Date
  arrivalCountry: string
  arrivalCity: string
  arrivalDate: Date
  intermediateStops?: CreateIntermediateStop[]
  description?: string
  price?: number
  transporterId: string
}

export class Route {
  readonly id: string
  readonly departureCountry: string
  readonly departureCity: string
  readonly departureDate: Date
  readonly arrivalCountry: string
  readonly arrivalCity: string
  readonly arrivalDate: Date
  readonly intermediateStops: IntermediateStop[]
  readonly description?: string
  readonly price?: number
  readonly transporterId: string
  readonly status: RouteStatus
  readonly createdAt: Date
  readonly updatedAt: Date

  constructor(createRoute: CreateRoute) {
    this.id = randomUUID()
    this.departureCountry = createRoute.departureCountry
    this.departureCity = createRoute.departureCity
    this.departureDate = createRoute.departureDate
    this.arrivalCountry = createRoute.arrivalCountry
    this.arrivalCity = createRoute.arrivalCity
    this.arrivalDate = createRoute.arrivalDate
    this.description = createRoute.description
    this.price = createRoute.price
    this.transporterId = createRoute.transporterId
    this.status = RouteStatus.CREATED
    this.createdAt = new Date()
    this.updatedAt = new Date()

    // Create intermediate stops with IDs
    this.intermediateStops = (createRoute.intermediateStops || []).map(
      (stop, index) => new IntermediateStop(`${this.id}-stop-${index}`, stop),
    )

    this.validate()
  }

  // Business validation
  private validate(): void {
    if (this.departureDate >= this.arrivalDate) {
      throw new Error(RouteErrors.ARRIVAL_BEFORE_DEPARTURE)
    }

    if (this.price !== undefined && this.price < 0) {
      throw new Error(RouteErrors.NEGATIVE_PRICE)
    }

    // Validate intermediate stops are chronologically ordered
    let lastDate = this.departureDate
    for (const stop of this.intermediateStops) {
      if (stop.date <= lastDate || stop.date >= this.arrivalDate) {
        throw new Error(RouteErrors.INVALID_INTERMEDIATE_STOPS_ORDER)
      }
      lastDate = stop.date
    }
  }

  // Business methods
  isPublished(): boolean {
    return this.status === RouteStatus.PUBLISHED
  }

  canBeModified(): boolean {
    return (
      this.status === RouteStatus.CREATED ||
      this.status === RouteStatus.PUBLISHED
    )
  }

  isInPast(): boolean {
    return this.departureDate < new Date()
  }

  hasIntermediateStops(): boolean {
    return this.intermediateStops.length > 0
  }

  // Factory method for published route
  publish(): Route {
    if (!this.canBeModified()) {
      throw new Error(RouteErrors.CANNOT_PUBLISH_INVALID_STATUS)
    }

    return this.withStatus(RouteStatus.PUBLISHED)
  }

  // Factory method for cancelled route
  cancel(): Route {
    if (!this.canBeModified()) {
      throw new Error(RouteErrors.CANNOT_CANCEL_INVALID_STATUS)
    }

    return this.withStatus(RouteStatus.CANCELLED)
  }

  // Factory method for completed route
  complete(): Route {
    if (this.status !== RouteStatus.PUBLISHED) {
      throw new Error(RouteErrors.ONLY_PUBLISHED_CAN_COMPLETE)
    }

    return this.withStatus(RouteStatus.COMPLETED)
  }

  // Helper method to create a new Route with updated status
  private withStatus(newStatus: RouteStatus): Route {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), {
      ...this,
      status: newStatus,
      updatedAt: new Date(),
    })
  }
}
