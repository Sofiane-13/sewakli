import { Inject, Injectable } from '@nestjs/common'
import {
  IRouteRepositoryToken,
  IRouteRepository,
} from '../outboundPorts/IRouteRepository'
import { CreateRoute, Route } from '../model/Route'
import { IRouteService } from './IRouteService'
import { SearchRouteInput } from '../model/dto/RouteDto'
import { RouteNotFoundException } from '../exceptions/route.exceptions'

/**
 * RouteService implements route business logic
 *
 * Responsibilities:
 * - Route creation and validation
 * - Route state transitions (publish, cancel, complete)
 * - Route search and retrieval
 */
@Injectable()
export class RouteService implements IRouteService {
  constructor(
    @Inject(IRouteRepositoryToken)
    private readonly routeRepository: IRouteRepository,
  ) {}

  /**
   * Creates a new route
   * @param createRoute - Route creation data
   * @returns Created route
   * @throws ArrivalBeforeDepartureException if dates are invalid
   * @throws NegativePriceException if price is negative
   * @throws InvalidIntermediateStopsOrderException if stops are not ordered
   */
  async createRoute(createRoute: CreateRoute): Promise<Route> {
    const route = new Route(createRoute)
    return this.routeRepository.save(route)
  }

  /**
   * Retrieves a route by ID
   * @param id - Route identifier
   * @returns Route if found, null otherwise
   */
  async getRouteById(id: string): Promise<Route | null> {
    return this.routeRepository.findById(id)
  }

  /**
   * Searches for routes matching criteria
   * @param searchInput - Search criteria
   * @returns Array of matching routes
   */
  async searchRoutes(searchInput: SearchRouteInput): Promise<Route[]> {
    return this.routeRepository.search(searchInput)
  }

  /**
   * Retrieves all routes
   * @returns Array of all routes
   */
  async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll()
  }

  /**
   * Publishes a route
   * @param id - Route identifier
   * @returns Published route
   * @throws RouteNotFoundException if route not found
   * @throws CannotPublishRouteException if route cannot be published
   */
  async publishRoute(id: string): Promise<Route> {
    const route = await this.findRouteOrThrow(id)
    const publishedRoute = route.publish()
    return this.routeRepository.save(publishedRoute)
  }

  /**
   * Cancels a route
   * @param id - Route identifier
   * @returns Cancelled route
   * @throws RouteNotFoundException if route not found
   * @throws CannotCancelRouteException if route cannot be cancelled
   */
  async cancelRoute(id: string): Promise<Route> {
    const route = await this.findRouteOrThrow(id)

    const cancelledRoute = route.cancel()
    return this.routeRepository.save(cancelledRoute)
  }

  /**
   * Completes a route
   * @param id - Route identifier
   * @returns Completed route
   * @throws RouteNotFoundException if route not found
   * @throws CannotCompleteRouteException if route cannot be completed
   */
  async completeRoute(id: string): Promise<Route> {
    const route = await this.findRouteOrThrow(id)
    const completedRoute = route.complete()
    return this.routeRepository.save(completedRoute)
  }

  /**
   * Retrieves all routes for a specific transporter
   * @param transporterId - Transporter identifier
   * @returns Array of routes belonging to the transporter
   */
  async getRoutesByTransporter(transporterId: string): Promise<Route[]> {
    return this.routeRepository.findByTransporterId(transporterId)
  }

  /**
   * Helper method to find a route or throw exception
   * @private
   * @param id - Route identifier
   * @returns Route if found
   * @throws RouteNotFoundException if route not found
   */
  private async findRouteOrThrow(id: string): Promise<Route> {
    const route = await this.routeRepository.findById(id)
    if (!route) {
      throw new RouteNotFoundException(id)
    }
    return route
  }
}
