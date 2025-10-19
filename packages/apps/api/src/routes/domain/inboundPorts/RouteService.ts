import { Inject, Injectable } from '@nestjs/common'
import {
  IRouteRepositoryToken,
  IRouteRepository,
} from '../outboundPorts/IRouteRepository'
import { CreateRoute, Route } from '../model/Route'
import { IRouteService } from './IRouteService'
import { SearchRouteInput } from '../model/dto/RouteDto'
import { RouteErrors } from '../errors/RouteErrors'

@Injectable()
export class RouteService implements IRouteService {
  constructor(
    @Inject(IRouteRepositoryToken)
    private readonly routeRepository: IRouteRepository,
  ) {}

  async createRoute(createRoute: CreateRoute): Promise<Route> {
    const route = new Route(createRoute)
    return this.routeRepository.save(route)
  }

  async getRouteById(id: string): Promise<Route | null> {
    return this.routeRepository.findById(id)
  }

  async searchRoutes(searchInput: SearchRouteInput): Promise<Route[]> {
    return this.routeRepository.search(searchInput)
  }

  async getAllRoutes(): Promise<Route[]> {
    return this.routeRepository.findAll()
  }

  async publishRoute(id: string): Promise<Route> {
    const route = await this.routeRepository.findById(id)
    if (!route) {
      throw new Error(RouteErrors.routeNotFound(id))
    }

    const publishedRoute = route.publish()
    return this.routeRepository.save(publishedRoute)
  }

  async cancelRoute(id: string): Promise<Route> {
    const route = await this.routeRepository.findById(id)
    if (!route) {
      throw new Error(RouteErrors.routeNotFound(id))
    }

    const cancelledRoute = route.cancel()
    return this.routeRepository.save(cancelledRoute)
  }

  async completeRoute(id: string): Promise<Route> {
    const route = await this.routeRepository.findById(id)
    if (!route) {
      throw new Error(RouteErrors.routeNotFound(id))
    }

    const completedRoute = route.complete()
    return this.routeRepository.save(completedRoute)
  }

  async getRoutesByTransporter(transporterId: string): Promise<Route[]> {
    return this.routeRepository.findByTransporterId(transporterId)
  }
}
