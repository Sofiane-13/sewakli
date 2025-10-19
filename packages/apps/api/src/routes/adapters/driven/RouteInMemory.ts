import { Injectable } from '@nestjs/common'
import { IRouteRepository } from '../../domain/outboundPorts/IRouteRepository'
import { Route } from '../../domain/model/Route'
import { SearchRouteInput } from '../../domain/model/dto/RouteDto'
import { DateHelper } from '../../domain/helpers/DateHelper'

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

  async search(searchInput: SearchRouteInput): Promise<Route[]> {
    let results = Array.from(this.routes.values())

    // Filter by departure country
    if (searchInput.departureCountry) {
      results = results.filter(
        (route) => route.departureCountry === searchInput.departureCountry,
      )
    }

    // Filter by departure city
    if (searchInput.departureCity) {
      results = results.filter(
        (route) => route.departureCity === searchInput.departureCity,
      )
    }

    // Filter by departure date (same day)
    if (searchInput.departureDate) {
      results = results.filter((route) =>
        DateHelper.isSameDay(route.departureDate, searchInput.departureDate!),
      )
    }

    // Filter by arrival country
    if (searchInput.arrivalCountry) {
      results = results.filter(
        (route) => route.arrivalCountry === searchInput.arrivalCountry,
      )
    }

    // Filter by arrival city
    if (searchInput.arrivalCity) {
      results = results.filter(
        (route) => route.arrivalCity === searchInput.arrivalCity,
      )
    }

    // Filter by arrival date (same day)
    if (searchInput.arrivalDate) {
      results = results.filter((route) =>
        DateHelper.isSameDay(route.arrivalDate, searchInput.arrivalDate!),
      )
    }

    // Filter by status
    if (searchInput.status) {
      results = results.filter((route) => route.status === searchInput.status)
    }

    return results
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
