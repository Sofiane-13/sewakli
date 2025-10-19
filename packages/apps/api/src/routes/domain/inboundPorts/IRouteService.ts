import { CreateRoute, Route } from '../model/Route'
import { SearchRouteInput } from '../model/dto/RouteDto'

export const IRouteServiceToken = Symbol('IRouteService')

export interface IRouteService {
  createRoute(createRoute: CreateRoute): Promise<Route>
  getRouteById(id: string): Promise<Route | null>
  searchRoutes(searchInput: SearchRouteInput): Promise<Route[]>
  getAllRoutes(): Promise<Route[]>
  publishRoute(id: string): Promise<Route>
  cancelRoute(id: string): Promise<Route>
  completeRoute(id: string): Promise<Route>
  getRoutesByTransporter(transporterId: string): Promise<Route[]>
}
