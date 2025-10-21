import { Route } from '../../domain/entities/Route'
import { IRouteRepository } from '../../domain/ports/IRouteRepository.new'
import { RouteDTO } from '../dtos/RouteDTO'

/**
 * Use Case: Get All Routes
 * Retrieves all routes from the system
 */
export class GetAllRoutesUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(): Promise<RouteDTO[]> {
    // 1. Get all routes
    const routes = await this.routeRepository.findAll()

    // 2. Convert to DTOs and return
    return routes.map((route) => this.toDTO(route))
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
