import { ApolloClient, gql } from '@apollo/client'
import { IRouteRepository, RouteSearchCriteria } from '../../domain/ports/IRouteRepository.new'
import { Route } from '../../domain/entities/Route'
import { RouteMapper, GraphQLRouteResponse } from '../mappers/RouteMapper'
import { GraphQLError as GraphQLErr, NetworkError } from '../errors/RepositoryError'

/**
 * GraphQL Route Repository Implementation
 * Implements the IRouteRepository interface using GraphQL
 */
export class GraphQLRouteRepositoryNew implements IRouteRepository {
  constructor(private readonly apolloClient: ApolloClient<any>) {}

  async save(route: Route): Promise<void> {
    try {
      const mutation = gql`
        mutation CreateRoute(
          $transporterId: String!
          $departureCountry: String!
          $departureCity: String!
          $departureDate: String!
          $arrivalCountry: String!
          $arrivalCity: String!
          $arrivalDate: String
          $intermediateStops: [IntermediateStopInput!]
          $description: String
          $price: Float
        ) {
          createRoute(
            transporterId: $transporterId
            departureCountry: $departureCountry
            departureCity: $departureCity
            departureDate: $departureDate
            arrivalCountry: $arrivalCountry
            arrivalCity: $arrivalCity
            arrivalDate: $arrivalDate
            intermediateStops: $intermediateStops
            description: $description
            price: $price
          ) {
            id
            departureCountry
            departureCity
            departureDate
            arrivalCountry
            arrivalCity
            arrivalDate
            intermediateStops {
              id
              country
              city
              date
            }
            description
            price
            transporterId
            status
            createdAt
            updatedAt
          }
        }
      `

      const variables = {
        transporterId: route.getTransporterId(),
        departureCountry: route.getDeparture().getCountry(),
        departureCity: route.getDeparture().getCity(),
        departureDate: route.getDepartureDate().toISOString(),
        arrivalCountry: route.getArrival().getCountry(),
        arrivalCity: route.getArrival().getCity(),
        arrivalDate: route.getArrivalDate()?.toISOString(),
        intermediateStops: route.getIntermediateStops().map((stop) => ({
          country: stop.getLocation().getCountry(),
          city: stop.getLocation().getCity(),
        })),
        description: route.getDescription(),
        price: route.getPrice()?.getValue(),
      }

      await this.apolloClient.mutate({
        mutation,
        variables,
      })
    } catch (error) {
      if (error instanceof Error) {
        throw new GraphQLErr('Failed to save route', error)
      }
      throw new GraphQLErr('Unknown error saving route')
    }
  }

  async findById(id: string): Promise<Route | null> {
    try {
      const query = gql`
        query GetRoute($id: String!) {
          route(id: $id) {
            id
            departureCountry
            departureCity
            departureDate
            arrivalCountry
            arrivalCity
            arrivalDate
            intermediateStops {
              id
              country
              city
              date
            }
            description
            price
            transporterId
            status
            createdAt
            updatedAt
          }
        }
      `

      const result = await this.apolloClient.query({
        query,
        variables: { id },
        fetchPolicy: 'network-only',
      })

      if (!result.data?.route) {
        return null
      }

      return RouteMapper.toDomain(result.data.route as GraphQLRouteResponse)
    } catch (error) {
      if (error instanceof Error) {
        throw new GraphQLErr('Failed to find route', error)
      }
      throw new GraphQLErr('Unknown error finding route')
    }
  }

  async findAll(): Promise<Route[]> {
    try {
      const query = gql`
        query GetAllRoutes {
          routes {
            id
            departureCountry
            departureCity
            departureDate
            arrivalCountry
            arrivalCity
            arrivalDate
            intermediateStops {
              id
              country
              city
              date
            }
            description
            price
            transporterId
            status
            createdAt
            updatedAt
          }
        }
      `

      const result = await this.apolloClient.query({
        query,
        fetchPolicy: 'network-only',
      })

      if (!result.data?.routes) {
        return []
      }

      return result.data.routes.map((route: GraphQLRouteResponse) =>
        RouteMapper.toDomain(route),
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new GraphQLErr('Failed to fetch all routes', error)
      }
      throw new GraphQLErr('Unknown error fetching routes')
    }
  }

  async findByTransporterId(transporterId: string): Promise<Route[]> {
    try {
      const query = gql`
        query GetRoutesByTransporter($transporterId: String!) {
          routesByTransporter(transporterId: $transporterId) {
            id
            departureCountry
            departureCity
            departureDate
            arrivalCountry
            arrivalCity
            arrivalDate
            intermediateStops {
              id
              country
              city
              date
            }
            description
            price
            transporterId
            status
            createdAt
            updatedAt
          }
        }
      `

      const result = await this.apolloClient.query({
        query,
        variables: { transporterId },
        fetchPolicy: 'network-only',
      })

      if (!result.data?.routesByTransporter) {
        return []
      }

      return result.data.routesByTransporter.map((route: GraphQLRouteResponse) =>
        RouteMapper.toDomain(route),
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new GraphQLErr('Failed to fetch routes by transporter', error)
      }
      throw new GraphQLErr('Unknown error fetching routes')
    }
  }

  async search(criteria: RouteSearchCriteria): Promise<Route[]> {
    try {
      const query = gql`
        query SearchRoutes(
          $departureCountry: String
          $departureCity: String
          $departureDate: String
          $arrivalCountry: String
          $arrivalCity: String
          $arrivalDate: String
        ) {
          searchRoutes(
            departureCountry: $departureCountry
            departureCity: $departureCity
            departureDate: $departureDate
            arrivalCountry: $arrivalCountry
            arrivalCity: $arrivalCity
            arrivalDate: $arrivalDate
          ) {
            id
            departureCountry
            departureCity
            departureDate
            arrivalCountry
            arrivalCity
            arrivalDate
            intermediateStops {
              id
              country
              city
              date
            }
            description
            price
            transporterId
            status
            createdAt
            updatedAt
          }
        }
      `

      const result = await this.apolloClient.query({
        query,
        variables: criteria,
        fetchPolicy: 'network-only',
      })

      if (!result.data?.searchRoutes) {
        return []
      }

      return result.data.searchRoutes.map((route: GraphQLRouteResponse) =>
        RouteMapper.toDomain(route),
      )
    } catch (error) {
      if (error instanceof Error) {
        throw new GraphQLErr('Failed to search routes', error)
      }
      throw new GraphQLErr('Unknown error searching routes')
    }
  }

  async update(route: Route): Promise<void> {
    try {
      const mutation = gql`
        mutation UpdateRoute(
          $id: String!
          $status: String!
          $updatedAt: String!
        ) {
          updateRoute(id: $id, status: $status, updatedAt: $updatedAt) {
            id
            status
            updatedAt
          }
        }
      `

      const variables = {
        id: route.getId().getValue(),
        status: route.getStatus().toString(),
        updatedAt: route.getUpdatedAt().toISOString(),
      }

      await this.apolloClient.mutate({
        mutation,
        variables,
      })
    } catch (error) {
      if (error instanceof Error) {
        throw new GraphQLErr('Failed to update route', error)
      }
      throw new GraphQLErr('Unknown error updating route')
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const mutation = gql`
        mutation DeleteRoute($id: String!) {
          deleteRoute(id: $id)
        }
      `

      await this.apolloClient.mutate({
        mutation,
        variables: { id },
      })
    } catch (error) {
      if (error instanceof Error) {
        throw new GraphQLErr('Failed to delete route', error)
      }
      throw new GraphQLErr('Unknown error deleting route')
    }
  }
}
