/**
 * Value Object: Location
 * Represents a geographical location with country and city
 */
export class Location {
  private readonly country: string
  private readonly city: string

  private constructor(country: string, city: string) {
    this.country = country
    this.city = city
  }

  static create(country: string, city: string): Location {
    if (!country || country.trim().length === 0) {
      throw new Error('Country cannot be empty')
    }
    if (!city || city.trim().length === 0) {
      throw new Error('City cannot be empty')
    }
    return new Location(country.trim(), city.trim())
  }

  getCountry(): string {
    return this.country
  }

  getCity(): string {
    return this.city
  }

  equals(other: Location): boolean {
    return this.country === other.country && this.city === other.city
  }

  toString(): string {
    return `${this.city}, ${this.country}`
  }
}
