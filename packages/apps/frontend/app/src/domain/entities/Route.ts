import { RouteId } from '../valueObjects/RouteId'
import { Location } from '../valueObjects/Location'
import { DateValue } from '../valueObjects/DateValue'
import { Price } from '../valueObjects/Price'
import { Stop } from '../valueObjects/Stop'
import { RouteStatusValue, RouteStatus } from '../valueObjects/RouteStatus'
import {
  InvalidRouteTransitionError,
  RouteValidationError,
} from '../errors/DomainError'

/**
 * Domain Entity: Route
 * Aggregate root for route management
 * Encapsulates all business rules related to routes
 */
export class Route {
  private constructor(
    private readonly id: RouteId,
    private readonly transporterId: string,
    private readonly departure: Location,
    private readonly departureDate: DateValue,
    private readonly arrival: Location,
    private readonly arrivalDate: DateValue | null,
    private readonly intermediateStops: Stop[],
    private status: RouteStatusValue,
    private readonly description: string | null,
    private readonly price: Price | null,
    private readonly createdAt: DateValue,
    private updatedAt: DateValue,
  ) {}

  /**
   * Factory method to create a new Route (DRAFT status)
   */
  static create(params: {
    id: string
    transporterId: string
    departure: Location
    departureDate: DateValue
    arrival: Location
    arrivalDate?: DateValue
    intermediateStops?: Stop[]
    description?: string
    price?: Price
  }): Route {
    const route = new Route(
      RouteId.create(params.id),
      params.transporterId,
      params.departure,
      params.departureDate,
      params.arrival,
      params.arrivalDate || null,
      params.intermediateStops || [],
      RouteStatusValue.draft(),
      params.description || null,
      params.price || null,
      DateValue.fromDate(new Date()),
      DateValue.fromDate(new Date()),
    )

    route.validate()
    return route
  }

  /**
   * Factory method to reconstitute a Route from persistence
   */
  static reconstitute(params: {
    id: string
    transporterId: string
    departure: Location
    departureDate: DateValue
    arrival: Location
    arrivalDate: DateValue | null
    intermediateStops: Stop[]
    status: RouteStatusValue
    description: string | null
    price: Price | null
    createdAt: DateValue
    updatedAt: DateValue
  }): Route {
    return new Route(
      RouteId.create(params.id),
      params.transporterId,
      params.departure,
      params.departureDate,
      params.arrival,
      params.arrivalDate,
      params.intermediateStops,
      params.status,
      params.description,
      params.price,
      params.createdAt,
      params.updatedAt,
    )
  }

  /**
   * Business Rules Validation
   */
  validate(): void {
    // Rule: Arrival date must be after departure date
    if (this.arrivalDate && !this.arrivalDate.isAfter(this.departureDate)) {
      throw new RouteValidationError(
        'Arrival date must be after departure date',
      )
    }

    // Rule: Departure and arrival locations must be different
    if (this.departure.equals(this.arrival)) {
      throw new RouteValidationError(
        'Departure and arrival locations must be different',
      )
    }

    // Rule: Intermediate stops must have valid order
    const stopOrders = this.intermediateStops.map((stop) => stop.getOrder())
    const uniqueOrders = new Set(stopOrders)
    if (stopOrders.length !== uniqueOrders.size) {
      throw new RouteValidationError('Intermediate stops must have unique order')
    }
  }

  /**
   * Business Rule: Publish a route
   * Can only publish a DRAFT route
   */
  publish(): void {
    if (!this.status.canBePublished()) {
      throw new InvalidRouteTransitionError(
        this.status.toString(),
        RouteStatus.PUBLISHED,
      )
    }

    this.status = RouteStatusValue.published()
    this.updatedAt = DateValue.fromDate(new Date())
  }

  /**
   * Business Rule: Cancel a route
   * Can only cancel PUBLISHED or IN_PROGRESS routes
   */
  cancel(): void {
    if (!this.status.canBeCancelled()) {
      throw new InvalidRouteTransitionError(
        this.status.toString(),
        RouteStatus.CANCELLED,
      )
    }

    this.status = RouteStatusValue.create(RouteStatus.CANCELLED)
    this.updatedAt = DateValue.fromDate(new Date())
  }

  /**
   * Business Rule: Complete a route
   * Can only complete IN_PROGRESS routes
   */
  complete(): void {
    if (!this.status.canBeCompleted()) {
      throw new InvalidRouteTransitionError(
        this.status.toString(),
        RouteStatus.COMPLETED,
      )
    }

    this.status = RouteStatusValue.create(RouteStatus.COMPLETED)
    this.updatedAt = DateValue.fromDate(new Date())
  }

  /**
   * Getters
   */
  getId(): RouteId {
    return this.id
  }

  getTransporterId(): string {
    return this.transporterId
  }

  getDeparture(): Location {
    return this.departure
  }

  getDepartureDate(): DateValue {
    return this.departureDate
  }

  getArrival(): Location {
    return this.arrival
  }

  getArrivalDate(): DateValue | null {
    return this.arrivalDate
  }

  getIntermediateStops(): Stop[] {
    return [...this.intermediateStops] // Return copy to preserve immutability
  }

  getStatus(): RouteStatusValue {
    return this.status
  }

  getDescription(): string | null {
    return this.description
  }

  getPrice(): Price | null {
    return this.price
  }

  getCreatedAt(): DateValue {
    return this.createdAt
  }

  getUpdatedAt(): DateValue {
    return this.updatedAt
  }

  /**
   * Domain query methods
   */
  canBePublished(): boolean {
    return this.status.canBePublished()
  }

  canBeCancelled(): boolean {
    return this.status.canBeCancelled()
  }

  canBeCompleted(): boolean {
    return this.status.canBeCompleted()
  }

  isPublished(): boolean {
    return this.status.isPublished()
  }

  isDraft(): boolean {
    return this.status.isDraft()
  }
}
