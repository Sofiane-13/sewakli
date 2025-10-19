import { Route } from '../../Route'
import { IntermediateStop } from '../../IntermediateStop'
import { RouteDto } from '../RouteDto'
import { IntermediateStopDto } from '../IntermediateStopDto'

export class RouteMapper {
  static toDto(route: Route): RouteDto {
    return {
      id: route.id,
      departureCountry: route.departureCountry,
      departureCity: route.departureCity,
      departureDate: route.departureDate,
      arrivalCountry: route.arrivalCountry,
      arrivalCity: route.arrivalCity,
      arrivalDate: route.arrivalDate,
      intermediateStops: route.intermediateStops.map((stop) =>
        this.intermediateStopToDto(stop),
      ),
      description: route.description,
      price: route.price,
      transporterId: route.transporterId,
      status: route.status,
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
    }
  }

  static toDtoList(routes: Route[]): RouteDto[] {
    return routes.map((route) => this.toDto(route))
  }

  private static intermediateStopToDto(
    stop: IntermediateStop,
  ): IntermediateStopDto {
    return {
      id: stop.id,
      country: stop.country,
      city: stop.city,
      date: stop.date,
    }
  }
}
