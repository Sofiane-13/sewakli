import { Location } from './Location'

/**
 * Value Object: Stop
 * Represents an intermediate stop in a route
 */
export class Stop {
  private readonly location: Location
  private readonly order: number

  private constructor(location: Location, order: number) {
    this.location = location
    this.order = order
  }

  static create(location: Location, order: number): Stop {
    if (order < 0) {
      throw new Error('Stop order cannot be negative')
    }
    return new Stop(location, order)
  }

  getLocation(): Location {
    return this.location
  }

  getOrder(): number {
    return this.order
  }

  equals(other: Stop): boolean {
    return this.location.equals(other.location) && this.order === other.order
  }

  toString(): string {
    return `${this.order}: ${this.location.toString()}`
  }
}
