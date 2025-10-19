export interface CreateIntermediateStop {
  country: string
  city: string
  date: Date
}

export class IntermediateStop {
  readonly id: string
  readonly country: string
  readonly city: string
  readonly date: Date

  constructor(id: string, createIntermediateStop: CreateIntermediateStop) {
    this.id = id
    this.country = createIntermediateStop.country
    this.city = createIntermediateStop.city
    this.date = createIntermediateStop.date
  }

  // Business methods
  isSameLocation(other: IntermediateStop): boolean {
    return this.country === other.country && this.city === other.city
  }

  isInPast(): boolean {
    return this.date < new Date()
  }
}
