import { Inject } from '@nestjs/common'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
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

interface GraphQLContext {
  req: any
  res: any
}

@Resolver(() => RouteDto)
export class RouteResolver {
  constructor(
    @Inject(IRouteServiceToken)
    private readonly routeService: IRouteService,
  ) {}

  @Authorized()
  @Mutation(() => RouteDto)
  async createRoute(
    @Arg('input') input: CreateRouteInput,
    @Ctx() context: GraphQLContext,
  ): Promise<RouteDto> {
    const user = context.req.user
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
      transporterId: user.email,
    })

    return RouteMapper.toDto(route)
  }

  @Query(() => RouteDto, { nullable: true })
  async route(@Arg('id') id: string): Promise<RouteDto | null> {
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
    @Arg('input') input: SearchRouteInput,
  ): Promise<RouteDto[]> {
    const routes = await this.routeService.searchRoutes(input)
    return RouteMapper.toDtoList(routes)
  }

  @Authorized()
  @Query(() => [RouteDto])
  async routesByTransporter(
    @Ctx() context: GraphQLContext,
  ): Promise<RouteDto[]> {
    const user = context.req.user
    const routes = await this.routeService.getRoutesByTransporter(user.email)
    return RouteMapper.toDtoList(routes)
  }

  @Authorized()
  @Mutation(() => RouteDto)
  async publishRoute(@Arg('id') id: string): Promise<RouteDto> {
    const route = await this.routeService.publishRoute(id)
    return RouteMapper.toDto(route)
  }

  @Authorized()
  @Mutation(() => RouteDto)
  async cancelRoute(@Arg('id') id: string): Promise<RouteDto> {
    const route = await this.routeService.cancelRoute(id)
    return RouteMapper.toDto(route)
  }

  @Authorized()
  @Mutation(() => RouteDto)
  async completeRoute(@Arg('id') id: string): Promise<RouteDto> {
    const route = await this.routeService.completeRoute(id)
    return RouteMapper.toDto(route)
  }
}
