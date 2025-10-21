import { Route } from '../entities/Route'

/**
 * Repository Port (Interface)
 * Defines the contract for route persistence
 * This interface belongs to the domain layer
 * Infrastructure layer will implement this interface
 */
export interface IRouteRepository {
  /**
   * Save a new route
   */
  save(route: Route): Promise<void>

  /**
   * Find a route by its ID
   */
  findById(id: string): Promise<Route | null>

  /**
   * Find all routes
   */
  findAll(): Promise<Route[]>

  /**
   * Find routes by transporter ID
   */
  findByTransporterId(transporterId: string): Promise<Route[]>

  /**
   * Search routes by criteria
   */
  search(criteria: RouteSearchCriteria): Promise<Route[]>

  /**
   * Update an existing route
   */
  update(route: Route): Promise<void>

  /**
   * Delete a route
   */
  delete(id: string): Promise<void>
}

/**
 * Search criteria for routes
 */
export interface RouteSearchCriteria {
  departureCountry?: string
  departureCity?: string
  departureDate?: string
  arrivalCountry?: string
  arrivalCity?: string
  arrivalDate?: string
}
