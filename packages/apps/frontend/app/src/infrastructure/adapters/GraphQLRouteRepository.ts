import type { ApolloClient } from '@apollo/client'
import {
  IRouteRepository,
  RouteResponse,
} from '../../domain/ports/IRouteRepository'
import { RouteCreationData, RouteSearchData } from '../../types/route'
import {
  CANCEL_ROUTE,
  COMPLETE_ROUTE,
  CREATE_ROUTE,
  GET_ALL_ROUTES,
  GET_ROUTE,
  GET_ROUTES_BY_TRANSPORTER,
  PUBLISH_ROUTE,
  SEARCH_ROUTES,
} from '../graphql/operations/route.graphql'

export class GraphQLRouteRepository implements IRouteRepository {
  constructor(private apolloClient: ApolloClient) {}

  async createRoute(
    data: RouteCreationData & { description: string; price: string },
    transporterId: string,
  ): Promise<RouteResponse> {
    const result = await this.apolloClient.mutate({
      mutation: CREATE_ROUTE,
      variables: {
        input: {
          departureCountry: data.departureCountry,
          departureCity: data.departureCity,
          departureDate: new Date(data.departureDate),
          arrivalCountry: data.arrivalCountry,
          arrivalCity: data.arrivalCity,
          arrivalDate: new Date(data.arrivalDate),
          intermediateStops: data.intermediateStops.map((stop) => ({
            country: stop.country,
            city: stop.city,
            date: new Date(stop.date),
          })),
          description: data.description,
          price: parseFloat(data.price),
          transporterId,
        },
      },
    })

    if (!(result.data as any)?.createRoute) {
      throw new Error('Failed to create route')
    }

    return this.mapRouteResponse((result.data as any).createRoute)
  }

  async searchRoutes(criteria: RouteSearchData): Promise<RouteResponse[]> {
    const result = await this.apolloClient.query({
      query: SEARCH_ROUTES,
      variables: {
        input: {
          departureCountry: criteria.departureCountry || undefined,
          departureCity: criteria.departureCity || undefined,
          departureDate: criteria.departureDate
            ? new Date(criteria.departureDate)
            : undefined,
          arrivalCountry: criteria.arrivalCountry || undefined,
          arrivalCity: criteria.arrivalCity || undefined,
          arrivalDate: criteria.arrivalDate
            ? new Date(criteria.arrivalDate)
            : undefined,
        },
      },
    })

    return (
      (result.data as any)?.searchRoutes?.map(
        this.mapRouteResponse.bind(this),
      ) || []
    )
  }

  async getRoute(id: string): Promise<RouteResponse | null> {
    const result = await this.apolloClient.query({
      query: GET_ROUTE,
      variables: { id },
    })

    return (result.data as any)?.route
      ? this.mapRouteResponse((result.data as any).route)
      : null
  }

  async getAllRoutes(): Promise<RouteResponse[]> {
    const result = await this.apolloClient.query({
      query: GET_ALL_ROUTES,
    })

    return (
      (result.data as any)?.routes?.map(this.mapRouteResponse.bind(this)) || []
    )
  }

  async getRoutesByTransporter(
    transporterId: string,
  ): Promise<RouteResponse[]> {
    const result = await this.apolloClient.query({
      query: GET_ROUTES_BY_TRANSPORTER,
      variables: { transporterId },
    })

    return (
      (result.data as any)?.routesByTransporter?.map(
        this.mapRouteResponse.bind(this),
      ) || []
    )
  }

  async publishRoute(id: string): Promise<RouteResponse> {
    const result = await this.apolloClient.mutate({
      mutation: PUBLISH_ROUTE,
      variables: { id },
    })

    if (!(result.data as any)?.publishRoute) {
      throw new Error('Failed to publish route')
    }

    return this.mapRouteResponse((result.data as any).publishRoute)
  }

  async cancelRoute(id: string): Promise<RouteResponse> {
    const result = await this.apolloClient.mutate({
      mutation: CANCEL_ROUTE,
      variables: { id },
    })

    if (!(result.data as any)?.cancelRoute) {
      throw new Error('Failed to cancel route')
    }

    return this.mapRouteResponse((result.data as any).cancelRoute)
  }

  async completeRoute(id: string): Promise<RouteResponse> {
    const result = await this.apolloClient.mutate({
      mutation: COMPLETE_ROUTE,
      variables: { id },
    })

    if (!(result.data as any)?.completeRoute) {
      throw new Error('Failed to complete route')
    }

    return this.mapRouteResponse((result.data as any).completeRoute)
  }

  private mapRouteResponse(data: {
    id: string
    departureCountry: string
    departureCity: string
    departureDate: string
    arrivalCountry: string
    arrivalCity: string
    arrivalDate: string
    intermediateStops: {
      id: string
      country: string
      city: string
      date: string
    }[]
    description?: string
    price?: number
    transporterId: string
    status: string
    createdAt: string
    updatedAt: string
  }): RouteResponse {
    return {
      id: data.id,
      departureCountry: data.departureCountry,
      departureCity: data.departureCity,
      departureDate: data.departureDate,
      arrivalCountry: data.arrivalCountry,
      arrivalCity: data.arrivalCity,
      arrivalDate: data.arrivalDate,
      intermediateStops: data.intermediateStops.map((stop) => ({
        id: stop.id,
        country: stop.country,
        city: stop.city,
        date: stop.date,
      })),
      description: data.description,
      price: data.price,
      transporterId: data.transporterId,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }
}
