/**
 * Value Object: Price
 * Represents a price per kg with validation
 */
export class Price {
  private readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(value: number): Price {
    if (value < 0) {
      throw new Error('Price cannot be negative')
    }
    if (value > 1000) {
      throw new Error('Price cannot exceed 1000€ per kg')
    }
    return new Price(value)
  }

  getValue(): number {
    return this.value
  }

  equals(other: Price): boolean {
    return this.value === other.value
  }

  toString(): string {
    return `${this.value.toFixed(2)}€`
  }
}
