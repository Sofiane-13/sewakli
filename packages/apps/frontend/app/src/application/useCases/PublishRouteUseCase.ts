import { IRouteRepository } from '../../domain/ports/IRouteRepository.new'
import { RouteDTO } from '../dtos/RouteDTO'
import { RouteNotFoundError } from '../errors/ApplicationError'
import { Route } from '../../domain/entities/Route'

/**
 * Use Case: Publish Route
 * Publishes a draft route to make it visible to users
 */
export class PublishRouteUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(routeId: string): Promise<RouteDTO> {
    // 1. Find the route
    const route = await this.routeRepository.findById(routeId)

    if (!route) {
      throw new RouteNotFoundError(routeId)
    }

    // 2. Publish the route (business rule validation happens here)
    route.publish()

    // 3. Update the route
    await this.routeRepository.update(route)

    // 4. Return updated route as DTO
    return this.toDTO(route)
  }

  private toDTO(route: Route): RouteDTO {
    return {
      id: route.getId().getValue(),
      transporterId: route.getTransporterId(),
      departureCountry: route.getDeparture().getCountry(),
      departureCity: route.getDeparture().getCity(),
      departureDate: route.getDepartureDate().toISOString(),
      arrivalCountry: route.getArrival().getCountry(),
      arrivalCity: route.getArrival().getCity(),
      arrivalDate: route.getArrivalDate()?.toISOString() || null,
      intermediateStops: route.getIntermediateStops().map((stop) => ({
        country: stop.getLocation().getCountry(),
        city: stop.getLocation().getCity(),
        order: stop.getOrder(),
      })),
      status: route.getStatus().toString(),
      description: route.getDescription(),
      price: route.getPrice()?.getValue() || null,
      createdAt: route.getCreatedAt().toISOString(),
      updatedAt: route.getUpdatedAt().toISOString(),
    }
  }
}
