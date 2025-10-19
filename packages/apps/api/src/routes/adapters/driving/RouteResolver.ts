import { Inject } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  IRouteService,
  IRouteServiceToken,
} from '../../domain/inboundPorts/IRouteService'
import {
  CreateRouteInput,
  RouteDto,
  SearchRouteInput,
} from '../../domain/model/dto/RouteDto'
import { RouteMapper } from '../../domain/model/dto/mappers/RouteMapper'

@Resolver(() => RouteDto)
export class RouteResolver {
  constructor(
    @Inject(IRouteServiceToken)
    private readonly routeService: IRouteService,
  ) {}

  @Mutation(() => RouteDto)
  async createRoute(@Args('input') input: CreateRouteInput): Promise<RouteDto> {
    const route = await this.routeService.createRoute({
      departureCountry: input.departureCountry,
      departureCity: input.departureCity,
      departureDate: input.departureDate,
      arrivalCountry: input.arrivalCountry,
      arrivalCity: input.arrivalCity,
      arrivalDate: input.arrivalDate,
      intermediateStops: input.intermediateStops?.map((stop) => ({
        country: stop.country,
        city: stop.city,
        date: stop.date,
      })),
      description: input.description,
      price: input.price,
      transporterId: input.transporterId,
    })

    return RouteMapper.toDto(route)
  }

  @Query(() => RouteDto, { nullable: true })
  async route(@Args('id') id: string): Promise<RouteDto | null> {
    const route = await this.routeService.getRouteById(id)
    return route ? RouteMapper.toDto(route) : null
  }

  @Query(() => [RouteDto])
  async routes(): Promise<RouteDto[]> {
    const routes = await this.routeService.getAllRoutes()
    return RouteMapper.toDtoList(routes)
  }

  @Query(() => [RouteDto])
  async searchRoutes(
    @Args('input') input: SearchRouteInput,
  ): Promise<RouteDto[]> {
    const routes = await this.routeService.searchRoutes(input)
    return RouteMapper.toDtoList(routes)
  }

  @Query(() => [RouteDto])
  async routesByTransporter(
    @Args('transporterId') transporterId: string,
  ): Promise<RouteDto[]> {
    const routes = await this.routeService.getRoutesByTransporter(transporterId)
    return RouteMapper.toDtoList(routes)
  }

  @Mutation(() => RouteDto)
  async publishRoute(@Args('id') id: string): Promise<RouteDto> {
    const route = await this.routeService.publishRoute(id)
    return RouteMapper.toDto(route)
  }

  @Mutation(() => RouteDto)
  async cancelRoute(@Args('id') id: string): Promise<RouteDto> {
    const route = await this.routeService.cancelRoute(id)
    return RouteMapper.toDto(route)
  }

  @Mutation(() => RouteDto)
  async completeRoute(@Args('id') id: string): Promise<RouteDto> {
    const route = await this.routeService.completeRoute(id)
    return RouteMapper.toDto(route)
  }
}
