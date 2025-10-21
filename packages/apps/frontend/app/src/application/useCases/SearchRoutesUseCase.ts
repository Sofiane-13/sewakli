import { Route } from '../../domain/entities/Route'
import { IRouteRepository, RouteSearchCriteria } from '../../domain/ports/IRouteRepository.new'
import { SearchRoutesDTO, RouteDTO } from '../dtos/RouteDTO'

/**
 * Use Case: Search Routes
 * Handles searching for routes based on criteria
 */
export class SearchRoutesUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(dto: SearchRoutesDTO): Promise<RouteDTO[]> {
    // 1. Build search criteria
    const criteria: RouteSearchCriteria = {
      departureCountry: dto.departureCountry,
      departureCity: dto.departureCity,
      departureDate: dto.departureDate,
      arrivalCountry: dto.arrivalCountry,
      arrivalCity: dto.arrivalCity,
      arrivalDate: dto.arrivalDate,
    }

    // 2. Search routes
    const routes = await this.routeRepository.search(criteria)

    // 3. Filter only published routes
    const publishedRoutes = routes.filter((route) => route.isPublished())

    // 4. Convert to DTOs and return
    return publishedRoutes.map((route) => this.toDTO(route))
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
