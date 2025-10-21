/**
 * Value Object: DateValue
 * Represents a date in the domain with validation
 */
export class DateValue {
  private readonly value: Date

  private constructor(value: Date) {
    this.value = value
  }

  static create(dateString: string): DateValue {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format')
    }
    return new DateValue(date)
  }

  static fromDate(date: Date): DateValue {
    return new DateValue(date)
  }

  getValue(): Date {
    return this.value
  }

  toISOString(): string {
    return this.value.toISOString()
  }

  isAfter(other: DateValue): boolean {
    return this.value.getTime() > other.value.getTime()
  }

  isBefore(other: DateValue): boolean {
    return this.value.getTime() < other.value.getTime()
  }

  equals(other: DateValue): boolean {
    return this.value.getTime() === other.value.getTime()
  }

  toString(): string {
    return this.value.toISOString()
  }
}
