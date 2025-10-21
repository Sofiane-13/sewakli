/**
 * Data Transfer Objects for Route
 * Used to transfer data between layers
 */

/**
 * DTO for creating a new route
 */
export interface CreateRouteDTO {
  transporterId: string
  departureCountry: string
  departureCity: string
  departureDate: string
  arrivalCountry: string
  arrivalCity: string
  arrivalDate?: string
  intermediateStops?: IntermediateStopDTO[]
  description?: string
  price?: number
  email: string
}

/**
 * DTO for intermediate stops
 */
export interface IntermediateStopDTO {
  country: string
  city: string
  date?: string
  order: number
}

/**
 * DTO for route response
 */
export interface RouteDTO {
  id: string
  transporterId: string
  departureCountry: string
  departureCity: string
  departureDate: string
  arrivalCountry: string
  arrivalCity: string
  arrivalDate: string | null
  intermediateStops: IntermediateStopDTO[]
  status: string
  description: string | null
  price: number | null
  createdAt: string
  updatedAt: string
}

/**
 * DTO for searching routes
 */
export interface SearchRoutesDTO {
  departureCountry?: string
  departureCity?: string
  departureDate?: string
  arrivalCountry?: string
  arrivalCity?: string
  arrivalDate?: string
}
