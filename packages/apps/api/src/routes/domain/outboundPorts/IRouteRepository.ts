import { Route } from '../model/Route'
import { SearchRouteInput } from '../model/dto/RouteDto'

export const IRouteRepositoryToken = Symbol('IRouteRepository')

export interface IRouteRepository {
  save(route: Route): Promise<Route>
  findById(id: string): Promise<Route | null>
  findAll(): Promise<Route[]>
  search(searchInput: SearchRouteInput): Promise<Route[]>
  findByTransporterId(transporterId: string): Promise<Route[]>
  delete(id: string): Promise<boolean>
}
