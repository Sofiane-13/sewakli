import { RouteCreationData, RouteSearchData } from '../../types/route'

export interface RouteResponse {
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
}

export interface IRouteRepository {
  createRoute(
    data: RouteCreationData & { description: string; price: string },
  ): Promise<RouteResponse>
  searchRoutes(criteria: RouteSearchData): Promise<RouteResponse[]>
  getRoute(id: string): Promise<RouteResponse | null>
  getAllRoutes(): Promise<RouteResponse[]>
  getRoutesByTransporter(): Promise<RouteResponse[]>
  publishRoute(id: string): Promise<RouteResponse>
  cancelRoute(id: string): Promise<RouteResponse>
  completeRoute(id: string): Promise<RouteResponse>
}
