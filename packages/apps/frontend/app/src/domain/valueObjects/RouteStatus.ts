/**
 * Value Object: RouteStatus
 * Represents the status of a route in its lifecycle
 */
export enum RouteStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class RouteStatusValue {
  private readonly value: RouteStatus

  private constructor(value: RouteStatus) {
    this.value = value
  }

  static create(value: string): RouteStatusValue {
    const normalizedValue = value.toUpperCase()
    if (!Object.values(RouteStatus).includes(normalizedValue as RouteStatus)) {
      throw new Error(`Invalid route status: ${value}`)
    }
    return new RouteStatusValue(normalizedValue as RouteStatus)
  }

  static draft(): RouteStatusValue {
    return new RouteStatusValue(RouteStatus.DRAFT)
  }

  static published(): RouteStatusValue {
    return new RouteStatusValue(RouteStatus.PUBLISHED)
  }

  getValue(): RouteStatus {
    return this.value
  }

  isDraft(): boolean {
    return this.value === RouteStatus.DRAFT
  }

  isPublished(): boolean {
    return this.value === RouteStatus.PUBLISHED
  }

  isCompleted(): boolean {
    return this.value === RouteStatus.COMPLETED
  }

  isCancelled(): boolean {
    return this.value === RouteStatus.CANCELLED
  }

  canBePublished(): boolean {
    return this.value === RouteStatus.DRAFT
  }

  canBeCancelled(): boolean {
    return this.value === RouteStatus.PUBLISHED || this.value === RouteStatus.IN_PROGRESS
  }

  canBeCompleted(): boolean {
    return this.value === RouteStatus.IN_PROGRESS
  }

  equals(other: RouteStatusValue): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}
