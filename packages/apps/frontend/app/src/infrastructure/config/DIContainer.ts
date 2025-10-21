import { ApolloClient } from '@apollo/client'
import { apolloClient } from '../graphql/apolloClient'

// Domain Ports
import { IRouteRepository } from '../../domain/ports/IRouteRepository.new'

// Application Ports
import { IEmailService } from '../../application/ports/IEmailService'

// Application Use Cases
import { CreateRouteUseCase } from '../../application/useCases/CreateRouteUseCase'
import { SearchRoutesUseCase } from '../../application/useCases/SearchRoutesUseCase'
import { GetAllRoutesUseCase } from '../../application/useCases/GetAllRoutesUseCase'
import { PublishRouteUseCase } from '../../application/useCases/PublishRouteUseCase'

// Infrastructure Adapters
import { GraphQLRouteRepositoryNew } from '../adapters/GraphQLRouteRepositoryNew'
import { GraphQLEmailService } from '../adapters/GraphQLEmailService'

/**
 * Dependency Injection Container
 * Manages all dependencies and their lifecycle
 * This is the composition root of the application
 */
export class DIContainer {
  private static instance: DIContainer

  // Infrastructure
  private apolloClient: ApolloClient<any>

  // Repositories
  private routeRepository: IRouteRepository

  // Services
  private emailService: IEmailService

  // Use Cases
  private createRouteUseCase: CreateRouteUseCase
  private searchRoutesUseCase: SearchRoutesUseCase
  private getAllRoutesUseCase: GetAllRoutesUseCase
  private publishRouteUseCase: PublishRouteUseCase

  private constructor() {
    // Initialize infrastructure
    this.apolloClient = apolloClient

    // Initialize repositories
    this.routeRepository = new GraphQLRouteRepositoryNew(this.apolloClient)

    // Initialize services
    this.emailService = new GraphQLEmailService(this.apolloClient)

    // Initialize use cases
    this.createRouteUseCase = new CreateRouteUseCase(
      this.routeRepository,
      this.emailService,
    )
    this.searchRoutesUseCase = new SearchRoutesUseCase(this.routeRepository)
    this.getAllRoutesUseCase = new GetAllRoutesUseCase(this.routeRepository)
    this.publishRouteUseCase = new PublishRouteUseCase(this.routeRepository)
  }

  /**
   * Get the singleton instance of the DI Container
   */
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer()
    }
    return DIContainer.instance
  }

  /**
   * Get Use Cases
   */
  getCreateRouteUseCase(): CreateRouteUseCase {
    return this.createRouteUseCase
  }

  getSearchRoutesUseCase(): SearchRoutesUseCase {
    return this.searchRoutesUseCase
  }

  getGetAllRoutesUseCase(): GetAllRoutesUseCase {
    return this.getAllRoutesUseCase
  }

  getPublishRouteUseCase(): PublishRouteUseCase {
    return this.publishRouteUseCase
  }

  /**
   * Get Repositories (for testing or other purposes)
   */
  getRouteRepository(): IRouteRepository {
    return this.routeRepository
  }

  /**
   * Get Services (for testing or other purposes)
   */
  getEmailService(): IEmailService {
    return this.emailService
  }

  /**
   * For testing: Reset the instance
   */
  static resetInstance(): void {
    DIContainer.instance = null as any
  }
}

/**
 * Convenience function to get the DI Container
 */
export const getDIContainer = (): DIContainer => {
  return DIContainer.getInstance()
}
