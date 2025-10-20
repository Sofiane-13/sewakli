import { randomUUID } from 'crypto'
import { CreateIntermediateStop, IntermediateStop } from './IntermediateStop'
import {
  ArrivalBeforeDepartureException,
  NegativePriceException,
  InvalidIntermediateStopsOrderException,
  CannotPublishRouteException,
  CannotCancelRouteException,
  CannotCompleteRouteException,
} from '../exceptions/route.exceptions'

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

  /**
   * Validates business rules for the route
   * @private
   * @throws ArrivalBeforeDepartureException if arrival is not after departure
   * @throws NegativePriceException if price is negative
   * @throws InvalidIntermediateStopsOrderException if stops are not chronologically ordered
   */
  private validate(): void {
    // Validate dates
    if (this.departureDate >= this.arrivalDate) {
      throw new ArrivalBeforeDepartureException()
    }

    // Validate price
    if (this.price !== undefined && this.price < 0) {
      throw new NegativePriceException(this.price)
    }

    // Validate intermediate stops chronological order
    let lastDate = this.departureDate
    for (const stop of this.intermediateStops) {
      if (stop.date <= lastDate || stop.date >= this.arrivalDate) {
        throw new InvalidIntermediateStopsOrderException()
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

  /**
   * Transitions route to PUBLISHED status
   * @returns new Route instance with PUBLISHED status
   * @throws CannotPublishRouteException if route cannot be published from current status
   */
  publish(): Route {
    if (!this.canBeModified()) {
      throw new CannotPublishRouteException(this.status)
    }

    return this.withStatus(RouteStatus.PUBLISHED)
  }

  /**
   * Transitions route to CANCELLED status
   * @returns new Route instance with CANCELLED status
   * @throws CannotCancelRouteException if route cannot be cancelled from current status
   */
  cancel(): Route {
    if (!this.canBeModified()) {
      throw new CannotCancelRouteException(this.status)
    }

    return this.withStatus(RouteStatus.CANCELLED)
  }

  /**
   * Transitions route to COMPLETED status
   * @returns new Route instance with COMPLETED status
   * @throws CannotCompleteRouteException if route is not in PUBLISHED status
   */
  complete(): Route {
    if (this.status !== RouteStatus.PUBLISHED) {
      throw new CannotCompleteRouteException(this.status)
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
