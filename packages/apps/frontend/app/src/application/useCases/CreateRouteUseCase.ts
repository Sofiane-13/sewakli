import { Route } from '../../domain/entities/Route'
import { Location } from '../../domain/valueObjects/Location'
import { DateValue } from '../../domain/valueObjects/DateValue'
import { Price } from '../../domain/valueObjects/Price'
import { Stop } from '../../domain/valueObjects/Stop'
import { Email } from '../../domain/valueObjects/Email'
import { IRouteRepository } from '../../domain/ports/IRouteRepository.new'
import { IEmailService } from '../ports/IEmailService'
import { CreateRouteDTO, RouteDTO } from '../dtos/RouteDTO'
import {
  RouteCreationFailedError,
  EmailVerificationFailedError,
} from '../errors/ApplicationError'

/**
 * Use Case: Create Route
 * Handles the creation of a new route with email verification
 */
export class CreateRouteUseCase {
  constructor(
    private readonly routeRepository: IRouteRepository,
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: CreateRouteDTO): Promise<RouteDTO> {
    try {
      // 1. Validate email format
      const email = Email.create(dto.email)

      // 2. Send verification code (in real app, would wait for verification)
      await this.emailService.sendVerificationCode(email.getValue())

      // 3. Create value objects
      const departure = Location.create(dto.departureCountry, dto.departureCity)
      const departureDate = DateValue.create(dto.departureDate)
      const arrival = Location.create(dto.arrivalCountry, dto.arrivalCity)
      const arrivalDate = dto.arrivalDate
        ? DateValue.create(dto.arrivalDate)
        : undefined

      // 4. Create intermediate stops
      const intermediateStops =
        dto.intermediateStops?.map((stopDto) => {
          const location = Location.create(stopDto.country, stopDto.city)
          return Stop.create(location, stopDto.order)
        }) || []

      // 5. Create price if provided
      const price = dto.price ? Price.create(dto.price) : undefined

      // 6. Generate unique ID (in real app, could be UUID)
      const routeId = `route-${Date.now()}`

      // 7. Create Route entity
      const route = Route.create({
        id: routeId,
        transporterId: dto.transporterId,
        departure,
        departureDate,
        arrival,
        arrivalDate,
        intermediateStops,
        description: dto.description,
        price,
      })

      // 8. Validate business rules (done in Route.create)
      // route.validate() is called internally

      // 9. Persist route
      await this.routeRepository.save(route)

      // 10. Convert to DTO and return
      return this.toDTO(route)
    } catch (error) {
      if (error instanceof Error) {
        throw new RouteCreationFailedError(error.message)
      }
      throw new RouteCreationFailedError('Unknown error occurred')
    }
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
