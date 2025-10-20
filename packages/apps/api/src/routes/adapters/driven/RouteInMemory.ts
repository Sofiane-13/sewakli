import { Injectable } from '@nestjs/common'
import { IRouteRepository } from '../../domain/outboundPorts/IRouteRepository'
import { Route } from '../../domain/model/Route'
import { SearchRouteInput } from '../../domain/model/dto/RouteDto'
import { DateHelper } from '../../domain/helpers/DateHelper'

/**
 * Represents a point in a route (departure, intermediate stop, or arrival)
 */
interface RoutePoint {
  country: string
  city: string
  date: Date
}

@Injectable()
export class RouteInMemory implements IRouteRepository {
  private routes: Map<string, Route> = new Map()

  async save(route: Route): Promise<Route> {
    this.routes.set(route.id, route)
    return route
  }

  async findById(id: string): Promise<Route | null> {
    return this.routes.get(id) || null
  }

  async findAll(): Promise<Route[]> {
    return Array.from(this.routes.values())
  }

  /**
   * Search for routes matching the given criteria.
   * When both departure and arrival locations are specified, the search will return:
   * 1. Exact matches (routes with the same departure and arrival)
   * 2. Superset routes (longer routes that contain the searched segment)
   *
   * @param searchInput - The search criteria
   * @returns Array of matching routes
   */
  async search(searchInput: SearchRouteInput): Promise<Route[]> {
    const allRoutes = Array.from(this.routes.values())

    const isCompleteRouteSearch = this.isCompleteRouteSearch(searchInput)

    const filteredRoutes = isCompleteRouteSearch
      ? this.searchCompleteRoutes(allRoutes, searchInput)
      : this.searchPartialRoutes(allRoutes, searchInput)

    return this.filterByStatus(filteredRoutes, searchInput)
  }

  /**
   * Search for complete routes (both departure and arrival specified)
   * Includes exact matches and superset routes
   */
  private searchCompleteRoutes(
    routes: Route[],
    searchInput: SearchRouteInput,
  ): Route[] {
    return routes.filter((route) => {
      const isExactMatch = this.isExactMatch(route, searchInput)
      const isSupersetMatch = this.isSupersetRoute(route, searchInput)

      return isExactMatch || isSupersetMatch
    })
  }

  /**
   * Search for partial routes (only some criteria specified)
   * Uses traditional field-by-field filtering
   */
  private searchPartialRoutes(
    routes: Route[],
    searchInput: SearchRouteInput,
  ): Route[] {
    let results = routes

    if (searchInput.departureCountry) {
      results = results.filter(
        (route) => route.departureCountry === searchInput.departureCountry,
      )
    }

    if (searchInput.departureCity) {
      results = results.filter(
        (route) => route.departureCity === searchInput.departureCity,
      )
    }

    if (searchInput.departureDate) {
      results = results.filter((route) =>
        DateHelper.isSameDay(route.departureDate, searchInput.departureDate!),
      )
    }

    if (searchInput.arrivalCountry) {
      results = results.filter(
        (route) => route.arrivalCountry === searchInput.arrivalCountry,
      )
    }

    if (searchInput.arrivalCity) {
      results = results.filter(
        (route) => route.arrivalCity === searchInput.arrivalCity,
      )
    }

    if (searchInput.arrivalDate) {
      results = results.filter((route) =>
        DateHelper.isSameDay(route.arrivalDate, searchInput.arrivalDate!),
      )
    }

    return results
  }

  /**
   * Determine if the search is for a complete route (both departure and arrival specified)
   */
  private isCompleteRouteSearch(searchInput: SearchRouteInput): boolean {
    return Boolean(
      searchInput.departureCountry &&
        searchInput.departureCity &&
        searchInput.arrivalCountry &&
        searchInput.arrivalCity,
    )
  }

  /**
   * Check if a route is an exact match for the search criteria
   */
  private isExactMatch(route: Route, searchInput: SearchRouteInput): boolean {
    return (
      this.matchesLocation(
        route.departureCountry,
        route.departureCity,
        searchInput.departureCountry!,
        searchInput.departureCity!,
      ) &&
      this.matchesLocation(
        route.arrivalCountry,
        route.arrivalCity,
        searchInput.arrivalCountry!,
        searchInput.arrivalCity!,
      ) &&
      this.matchesDates(route, searchInput)
    )
  }

  /**
   * Filter routes by status if provided
   */
  private filterByStatus(
    routes: Route[],
    searchInput: SearchRouteInput,
  ): Route[] {
    if (!searchInput.status) {
      return routes
    }

    return routes.filter((route) => route.status === searchInput.status)
  }

  /**
   * Check if two locations match (country and city)
   */
  private matchesLocation(
    routeCountry: string,
    routeCity: string,
    searchCountry: string,
    searchCity: string,
  ): boolean {
    return routeCountry === searchCountry && routeCity === searchCity
  }

  /**
   * Check if a route matches the date criteria
   */
  private matchesDates(route: Route, searchInput: SearchRouteInput): boolean {
    const departureDateMatches = searchInput.departureDate
      ? DateHelper.isSameDay(route.departureDate, searchInput.departureDate)
      : true

    const arrivalDateMatches = searchInput.arrivalDate
      ? DateHelper.isSameDay(route.arrivalDate, searchInput.arrivalDate)
      : true

    return departureDateMatches && arrivalDateMatches
  }

  /**
   * Check if a route is a superset of the searched route.
   * A superset route contains the searched route as a segment within it.
   *
   * Example:
   *   Searched: Paris -> Lyon
   *   Superset: Paris -> Lyon -> Marseille (contains Paris -> Lyon)
   *   Superset: Berlin -> Paris -> Lyon -> Nice (contains Paris -> Lyon)
   *
   * @param route - The route to check
   * @param searchInput - The search criteria
   * @returns true if the route contains the searched segment
   */
  private isSupersetRoute(
    route: Route,
    searchInput: SearchRouteInput,
  ): boolean {
    const allPoints = this.buildRoutePoints(route)

    const departureIndex = this.findPointIndex(
      allPoints,
      searchInput.departureCountry!,
      searchInput.departureCity!,
      searchInput.departureDate,
    )

    if (departureIndex === -1) {
      return false
    }

    const arrivalIndex = this.findPointIndex(
      allPoints,
      searchInput.arrivalCountry!,
      searchInput.arrivalCity!,
      searchInput.arrivalDate,
      departureIndex + 1, // Must be after departure
    )

    return arrivalIndex !== -1
  }

  /**
   * Build all points of a route (departure, intermediate stops, arrival)
   */
  private buildRoutePoints(route: Route): RoutePoint[] {
    return [
      {
        country: route.departureCountry,
        city: route.departureCity,
        date: route.departureDate,
      },
      ...route.intermediateStops.map((stop) => ({
        country: stop.country,
        city: stop.city,
        date: stop.date,
      })),
      {
        country: route.arrivalCountry,
        city: route.arrivalCity,
        date: route.arrivalDate,
      },
    ]
  }

  /**
   * Find the index of a point in a route
   *
   * @param points - Array of route points
   * @param country - Country to search for
   * @param city - City to search for
   * @param date - Optional date to match (if undefined, only location matters)
   * @param startIndex - Index to start searching from (default: 0)
   * @returns Index of the point, or -1 if not found
   */
  private findPointIndex(
    points: RoutePoint[],
    country: string,
    city: string,
    date?: Date,
    startIndex: number = 0,
  ): number {
    return points.findIndex((point, index) => {
      if (index < startIndex) {
        return false
      }

      const locationMatches = point.country === country && point.city === city

      const dateMatches = date ? DateHelper.isSameDay(point.date, date) : true

      return locationMatches && dateMatches
    })
  }

  async findByTransporterId(transporterId: string): Promise<Route[]> {
    return Array.from(this.routes.values()).filter(
      (route) => route.transporterId === transporterId,
    )
  }

  async delete(id: string): Promise<boolean> {
    return this.routes.delete(id)
  }

  // Utility method for testing/development
  clear(): void {
    this.routes.clear()
  }
}
