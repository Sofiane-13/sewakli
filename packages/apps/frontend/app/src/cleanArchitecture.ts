/**
 * Clean Architecture Exports
 * This file provides a single entry point for all Clean Architecture components
 */

// ==================== DOMAIN LAYER ====================

// Value Objects
export { RouteId } from './domain/valueObjects/RouteId'
export { Location } from './domain/valueObjects/Location'
export { DateValue } from './domain/valueObjects/DateValue'
export { Price } from './domain/valueObjects/Price'
export { Email } from './domain/valueObjects/Email'
export { Stop } from './domain/valueObjects/Stop'
export {
  RouteStatus,
  RouteStatusValue,
} from './domain/valueObjects/RouteStatus'

// Entities
export { Route } from './domain/entities/Route'

// Domain Ports (Interfaces)
export type {
  IRouteRepository,
  RouteSearchCriteria,
} from './domain/ports/IRouteRepository.new'

// Domain Errors
export {
  DomainError,
  InvalidRouteTransitionError,
  RouteNotFoundError as DomainRouteNotFoundError,
  InvalidRouteDataError,
  RouteValidationError,
  InvalidValueObjectError,
} from './domain/errors/DomainError'

// ==================== APPLICATION LAYER ====================

// DTOs
export type {
  CreateRouteDTO,
  IntermediateStopDTO,
  RouteDTO,
  SearchRoutesDTO,
} from './application/dtos/RouteDTO'

// Application Ports
export type { IEmailService } from './application/ports/IEmailService'

// Use Cases
export { CreateRouteUseCase } from './application/useCases/CreateRouteUseCase'
export { SearchRoutesUseCase } from './application/useCases/SearchRoutesUseCase'
export { GetAllRoutesUseCase } from './application/useCases/GetAllRoutesUseCase'
export { PublishRouteUseCase } from './application/useCases/PublishRouteUseCase'

// Application Errors
export {
  ApplicationError,
  RouteCreationFailedError,
  RouteNotFoundError as ApplicationRouteNotFoundError,
  EmailVerificationFailedError,
  UnauthorizedError,
  ValidationError,
} from './application/errors/ApplicationError'

// ==================== INFRASTRUCTURE LAYER ====================

// Adapters
export { GraphQLRouteRepositoryNew } from './infrastructure/adapters/GraphQLRouteRepositoryNew'
export { GraphQLEmailService } from './infrastructure/adapters/GraphQLEmailService'

// Mappers
export { RouteMapper } from './infrastructure/mappers/RouteMapper'
export type { GraphQLRouteResponse } from './infrastructure/mappers/RouteMapper'

// Infrastructure Errors
export {
  RepositoryError,
  NetworkError,
  GraphQLError,
} from './infrastructure/errors/RepositoryError'

// DI Container
export { DIContainer, getDIContainer } from './infrastructure/config/DIContainer'

// ==================== PRESENTATION LAYER ====================

// Hooks
export { useCreateRouteNew } from './hooks/useCreateRoute.new'
export { useSearchRoutesNew } from './hooks/useSearchRoutes.new'
export { useGetAllRoutesNew } from './hooks/useGetAllRoutes.new'

export type { UseCreateRouteReturn } from './hooks/useCreateRoute.new'
export type { UseSearchRoutesReturn } from './hooks/useSearchRoutes.new'
export type { UseGetAllRoutesReturn } from './hooks/useGetAllRoutes.new'
