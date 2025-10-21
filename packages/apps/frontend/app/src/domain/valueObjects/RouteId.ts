/**
 * Value Object: RouteId
 * Represents a unique identifier for a Route in the domain
 */
export class RouteId {
  private readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value: string): RouteId {
    if (!value || value.trim().length === 0) {
      throw new Error('RouteId cannot be empty')
    }
    return new RouteId(value)
  }

  getValue(): string {
    return this.value
  }

  equals(other: RouteId): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
