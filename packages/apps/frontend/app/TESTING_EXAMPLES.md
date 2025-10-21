# 🧪 Exemples de Tests - Clean Architecture

## Vue d'ensemble

Avec la Clean Architecture, chaque couche peut être testée **indépendamment** sans dépendances externes.

---

## 1. Tests du Domain Layer (Entités & Value Objects)

### Test de l'Entité Route

```typescript
// __tests__/domain/entities/Route.test.ts
import { Route } from '../../../domain/entities/Route'
import { Location } from '../../../domain/valueObjects/Location'
import { DateValue } from '../../../domain/valueObjects/DateValue'
import { Price } from '../../../domain/valueObjects/Price'
import { RouteStatus } from '../../../domain/valueObjects/RouteStatus'
import {
  InvalidRouteTransitionError,
  RouteValidationError,
} from '../../../domain/errors/DomainError'

describe('Route Entity', () => {
  describe('create', () => {
    it('should create a route with valid data', () => {
      // Arrange
      const departure = Location.create('France', 'Paris')
      const arrival = Location.create('Spain', 'Madrid')
      const departureDate = DateValue.create('2025-01-01')
      const arrivalDate = DateValue.create('2025-01-05')
      const price = Price.create(10.5)

      // Act
      const route = Route.create({
        id: 'route-1',
        transporterId: 'transporter-1',
        departure,
        arrival,
        departureDate,
        arrivalDate,
        price,
      })

      // Assert
      expect(route.getId().getValue()).toBe('route-1')
      expect(route.getDeparture()).toBe(departure)
      expect(route.getArrival()).toBe(arrival)
      expect(route.getStatus().isDraft()).toBe(true)
    })

    it('should throw error when arrival date is before departure', () => {
      // Arrange
      const departure = Location.create('France', 'Paris')
      const arrival = Location.create('Spain', 'Madrid')
      const departureDate = DateValue.create('2025-01-05')
      const arrivalDate = DateValue.create('2025-01-01') // Before departure!

      // Act & Assert
      expect(() => {
        Route.create({
          id: 'route-1',
          transporterId: 'transporter-1',
          departure,
          arrival,
          departureDate,
          arrivalDate,
        })
      }).toThrow(RouteValidationError)
    })

    it('should throw error when departure equals arrival', () => {
      // Arrange
      const sameLocation = Location.create('France', 'Paris')
      const departureDate = DateValue.create('2025-01-01')

      // Act & Assert
      expect(() => {
        Route.create({
          id: 'route-1',
          transporterId: 'transporter-1',
          departure: sameLocation,
          arrival: sameLocation,
          departureDate,
        })
      }).toThrow(RouteValidationError)
    })
  })

  describe('publish', () => {
    it('should publish a draft route', () => {
      // Arrange
      const route = Route.create({
        id: 'route-1',
        transporterId: 'transporter-1',
        departure: Location.create('France', 'Paris'),
        arrival: Location.create('Spain', 'Madrid'),
        departureDate: DateValue.create('2025-01-01'),
      })

      // Act
      route.publish()

      // Assert
      expect(route.getStatus().isPublished()).toBe(true)
      expect(route.canBePublished()).toBe(false)
      expect(route.canBeCancelled()).toBe(true)
    })

    it('should throw error when publishing non-draft route', () => {
      // Arrange
      const route = Route.create({
        id: 'route-1',
        transporterId: 'transporter-1',
        departure: Location.create('France', 'Paris'),
        arrival: Location.create('Spain', 'Madrid'),
        departureDate: DateValue.create('2025-01-01'),
      })
      route.publish() // Already published

      // Act & Assert
      expect(() => {
        route.publish() // Try to publish again
      }).toThrow(InvalidRouteTransitionError)
    })
  })

  describe('cancel', () => {
    it('should cancel a published route', () => {
      // Arrange
      const route = Route.create({
        id: 'route-1',
        transporterId: 'transporter-1',
        departure: Location.create('France', 'Paris'),
        arrival: Location.create('Spain', 'Madrid'),
        departureDate: DateValue.create('2025-01-01'),
      })
      route.publish()

      // Act
      route.cancel()

      // Assert
      expect(route.getStatus().isCancelled()).toBe(true)
      expect(route.canBeCancelled()).toBe(false)
    })

    it('should throw error when cancelling draft route', () => {
      // Arrange
      const route = Route.create({
        id: 'route-1',
        transporterId: 'transporter-1',
        departure: Location.create('France', 'Paris'),
        arrival: Location.create('Spain', 'Madrid'),
        departureDate: DateValue.create('2025-01-01'),
      })

      // Act & Assert
      expect(() => {
        route.cancel()
      }).toThrow(InvalidRouteTransitionError)
    })
  })
})
```

### Test des Value Objects

```typescript
// __tests__/domain/valueObjects/Price.test.ts
import { Price } from '../../../domain/valueObjects/Price'

describe('Price Value Object', () => {
  it('should create valid price', () => {
    const price = Price.create(10.5)
    expect(price.getValue()).toBe(10.5)
    expect(price.toString()).toBe('10.50€')
  })

  it('should throw error for negative price', () => {
    expect(() => Price.create(-5)).toThrow('Price cannot be negative')
  })

  it('should throw error for price exceeding 1000€', () => {
    expect(() => Price.create(1001)).toThrow('Price cannot exceed 1000€')
  })

  it('should check equality', () => {
    const price1 = Price.create(10.5)
    const price2 = Price.create(10.5)
    const price3 = Price.create(20)

    expect(price1.equals(price2)).toBe(true)
    expect(price1.equals(price3)).toBe(false)
  })
})
```

```typescript
// __tests__/domain/valueObjects/Email.test.ts
import { Email } from '../../../domain/valueObjects/Email'

describe('Email Value Object', () => {
  it('should create valid email', () => {
    const email = Email.create('test@example.com')
    expect(email.getValue()).toBe('test@example.com')
  })

  it('should normalize email to lowercase', () => {
    const email = Email.create('Test@EXAMPLE.com')
    expect(email.getValue()).toBe('test@example.com')
  })

  it('should throw error for invalid email', () => {
    expect(() => Email.create('invalid-email')).toThrow('Invalid email format')
    expect(() => Email.create('')).toThrow('Email cannot be empty')
    expect(() => Email.create('test@')).toThrow('Invalid email format')
  })
})
```

---

## 2. Tests de l'Application Layer (Use Cases)

### Test de CreateRouteUseCase

```typescript
// __tests__/application/useCases/CreateRouteUseCase.test.ts
import { CreateRouteUseCase } from '../../../application/useCases/CreateRouteUseCase'
import { IRouteRepository } from '../../../domain/ports/IRouteRepository.new'
import { IEmailService } from '../../../application/ports/IEmailService'
import { Route } from '../../../domain/entities/Route'
import { CreateRouteDTO } from '../../../application/dtos/RouteDTO'

// Mock Repository
class InMemoryRouteRepository implements IRouteRepository {
  routes: Route[] = []

  async save(route: Route): Promise<void> {
    this.routes.push(route)
  }

  async findById(id: string): Promise<Route | null> {
    return this.routes.find((r) => r.getId().getValue() === id) || null
  }

  async findAll(): Promise<Route[]> {
    return this.routes
  }

  async findByTransporterId(transporterId: string): Promise<Route[]> {
    return this.routes.filter((r) => r.getTransporterId() === transporterId)
  }

  async search(): Promise<Route[]> {
    return this.routes
  }

  async update(route: Route): Promise<void> {
    const index = this.routes.findIndex(
      (r) => r.getId().getValue() === route.getId().getValue(),
    )
    if (index !== -1) {
      this.routes[index] = route
    }
  }

  async delete(id: string): Promise<void> {
    this.routes = this.routes.filter((r) => r.getId().getValue() !== id)
  }
}

// Mock Email Service
class MockEmailService implements IEmailService {
  sentEmails: string[] = []

  async sendVerificationCode(email: string): Promise<void> {
    this.sentEmails.push(email)
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    return code === '123456'
  }
}

describe('CreateRouteUseCase', () => {
  let repository: InMemoryRouteRepository
  let emailService: MockEmailService
  let useCase: CreateRouteUseCase

  beforeEach(() => {
    repository = new InMemoryRouteRepository()
    emailService = new MockEmailService()
    useCase = new CreateRouteUseCase(repository, emailService)
  })

  it('should create route with valid data', async () => {
    // Arrange
    const dto: CreateRouteDTO = {
      transporterId: 'transporter-1',
      departureCountry: 'France',
      departureCity: 'Paris',
      departureDate: '2025-01-01',
      arrivalCountry: 'Spain',
      arrivalCity: 'Madrid',
      arrivalDate: '2025-01-05',
      intermediateStops: [],
      description: 'Test route',
      price: 10.5,
      email: 'test@example.com',
    }

    // Act
    const result = await useCase.execute(dto)

    // Assert
    expect(result.id).toBeDefined()
    expect(result.departureCity).toBe('Paris')
    expect(result.arrivalCity).toBe('Madrid')
    expect(result.status).toBe('DRAFT')
    expect(repository.routes).toHaveLength(1)
    expect(emailService.sentEmails).toContain('test@example.com')
  })

  it('should create route with intermediate stops', async () => {
    // Arrange
    const dto: CreateRouteDTO = {
      transporterId: 'transporter-1',
      departureCountry: 'France',
      departureCity: 'Paris',
      departureDate: '2025-01-01',
      arrivalCountry: 'Spain',
      arrivalCity: 'Madrid',
      intermediateStops: [
        { country: 'France', city: 'Lyon', order: 0 },
        { country: 'Spain', city: 'Barcelona', order: 1 },
      ],
      email: 'test@example.com',
    }

    // Act
    const result = await useCase.execute(dto)

    // Assert
    expect(result.intermediateStops).toHaveLength(2)
    expect(result.intermediateStops[0].city).toBe('Lyon')
    expect(result.intermediateStops[1].city).toBe('Barcelona')
  })

  it('should throw error for invalid email', async () => {
    // Arrange
    const dto: CreateRouteDTO = {
      transporterId: 'transporter-1',
      departureCountry: 'France',
      departureCity: 'Paris',
      departureDate: '2025-01-01',
      arrivalCountry: 'Spain',
      arrivalCity: 'Madrid',
      email: 'invalid-email', // Invalid
    }

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow()
  })

  it('should throw error when arrival before departure', async () => {
    // Arrange
    const dto: CreateRouteDTO = {
      transporterId: 'transporter-1',
      departureCountry: 'France',
      departureCity: 'Paris',
      departureDate: '2025-01-05',
      arrivalCountry: 'Spain',
      arrivalCity: 'Madrid',
      arrivalDate: '2025-01-01', // Before departure!
      email: 'test@example.com',
    }

    // Act & Assert
    await expect(useCase.execute(dto)).rejects.toThrow()
  })
})
```

### Test de SearchRoutesUseCase

```typescript
// __tests__/application/useCases/SearchRoutesUseCase.test.ts
import { SearchRoutesUseCase } from '../../../application/useCases/SearchRoutesUseCase'
import { Route } from '../../../domain/entities/Route'
import { Location } from '../../../domain/valueObjects/Location'
import { DateValue } from '../../../domain/valueObjects/DateValue'

describe('SearchRoutesUseCase', () => {
  let repository: InMemoryRouteRepository
  let useCase: SearchRoutesUseCase

  beforeEach(() => {
    repository = new InMemoryRouteRepository()
    useCase = new SearchRoutesUseCase(repository)

    // Seed data
    const route1 = Route.create({
      id: 'route-1',
      transporterId: 'transporter-1',
      departure: Location.create('France', 'Paris'),
      arrival: Location.create('Spain', 'Madrid'),
      departureDate: DateValue.create('2025-01-01'),
    })
    route1.publish() // Published

    const route2 = Route.create({
      id: 'route-2',
      transporterId: 'transporter-2',
      departure: Location.create('France', 'Lyon'),
      arrival: Location.create('Italy', 'Rome'),
      departureDate: DateValue.create('2025-02-01'),
    })
    // Draft (not published)

    repository.routes = [route1, route2]
  })

  it('should return only published routes', async () => {
    // Act
    const results = await useCase.execute({})

    // Assert
    expect(results).toHaveLength(1)
    expect(results[0].id).toBe('route-1')
    expect(results[0].status).toBe('PUBLISHED')
  })

  it('should filter by departure city', async () => {
    // Act
    const results = await useCase.execute({
      departureCity: 'Paris',
    })

    // Assert
    expect(results).toHaveLength(1)
    expect(results[0].departureCity).toBe('Paris')
  })
})
```

---

## 3. Tests de l'Infrastructure Layer (Adapters)

### Test du RouteMapper

```typescript
// __tests__/infrastructure/mappers/RouteMapper.test.ts
import { RouteMapper, GraphQLRouteResponse } from '../../../infrastructure/mappers/RouteMapper'

describe('RouteMapper', () => {
  describe('toDomain', () => {
    it('should map GraphQL response to Domain entity', () => {
      // Arrange
      const graphqlResponse: GraphQLRouteResponse = {
        id: 'route-1',
        departureCountry: 'France',
        departureCity: 'Paris',
        departureDate: '2025-01-01T00:00:00.000Z',
        arrivalCountry: 'Spain',
        arrivalCity: 'Madrid',
        arrivalDate: '2025-01-05T00:00:00.000Z',
        intermediateStops: [],
        description: 'Test',
        price: 10.5,
        transporterId: 'transporter-1',
        status: 'DRAFT',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      }

      // Act
      const route = RouteMapper.toDomain(graphqlResponse)

      // Assert
      expect(route.getId().getValue()).toBe('route-1')
      expect(route.getDeparture().getCity()).toBe('Paris')
      expect(route.getArrival().getCity()).toBe('Madrid')
      expect(route.getPrice()?.getValue()).toBe(10.5)
    })

    it('should handle null price', () => {
      // Arrange
      const graphqlResponse: GraphQLRouteResponse = {
        id: 'route-1',
        departureCountry: 'France',
        departureCity: 'Paris',
        departureDate: '2025-01-01T00:00:00.000Z',
        arrivalCountry: 'Spain',
        arrivalCity: 'Madrid',
        arrivalDate: '2025-01-05T00:00:00.000Z',
        intermediateStops: [],
        transporterId: 'transporter-1',
        status: 'DRAFT',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      }

      // Act
      const route = RouteMapper.toDomain(graphqlResponse)

      // Assert
      expect(route.getPrice()).toBeNull()
    })
  })
})
```

---

## 4. Tests de la Presentation Layer (Hooks)

### Test du Hook avec Mock

```typescript
// __tests__/hooks/useCreateRoute.test.tsx
import { renderHook, act, waitFor } from '@testing-library/react'
import { useCreateRouteNew } from '../../../hooks/useCreateRoute.new'
import { DIContainer } from '../../../infrastructure/config/DIContainer'
import { CreateRouteUseCase } from '../../../application/useCases/CreateRouteUseCase'

// Mock du DI Container
jest.mock('../../../infrastructure/config/DIContainer')

describe('useCreateRouteNew', () => {
  let mockExecute: jest.Mock

  beforeEach(() => {
    mockExecute = jest.fn()

    const mockUseCase = {
      execute: mockExecute,
    } as unknown as CreateRouteUseCase

    ;(DIContainer.getInstance as jest.Mock).mockReturnValue({
      getCreateRouteUseCase: () => mockUseCase,
    })
  })

  it('should create route successfully', async () => {
    // Arrange
    const mockResult = {
      id: 'route-1',
      departureCity: 'Paris',
      arrivalCity: 'Madrid',
      // ... other fields
    }
    mockExecute.mockResolvedValue(mockResult)

    const { result } = renderHook(() => useCreateRouteNew())

    // Act
    let routeResult
    await act(async () => {
      routeResult = await result.current.createRoute({
        transporterId: 'transporter-1',
        departureCountry: 'France',
        departureCity: 'Paris',
        departureDate: '2025-01-01',
        arrivalCountry: 'Spain',
        arrivalCity: 'Madrid',
        email: 'test@example.com',
      })
    })

    // Assert
    expect(mockExecute).toHaveBeenCalled()
    expect(routeResult).toEqual(mockResult)
    expect(result.current.error).toBeNull()
  })

  it('should set error on failure', async () => {
    // Arrange
    const mockError = new Error('Creation failed')
    mockExecute.mockRejectedValue(mockError)

    const { result } = renderHook(() => useCreateRouteNew())

    // Act
    await act(async () => {
      try {
        await result.current.createRoute({
          transporterId: 'transporter-1',
          departureCountry: 'France',
          departureCity: 'Paris',
          departureDate: '2025-01-01',
          arrivalCountry: 'Spain',
          arrivalCity: 'Madrid',
          email: 'test@example.com',
        })
      } catch (error) {
        // Expected
      }
    })

    // Assert
    await waitFor(() => {
      expect(result.current.error).toEqual(mockError)
    })
  })

  it('should manage loading state', async () => {
    // Arrange
    mockExecute.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    )

    const { result } = renderHook(() => useCreateRouteNew())

    // Act
    act(() => {
      result.current.createRoute({
        transporterId: 'transporter-1',
        departureCountry: 'France',
        departureCity: 'Paris',
        departureDate: '2025-01-01',
        arrivalCountry: 'Spain',
        arrivalCity: 'Madrid',
        email: 'test@example.com',
      })
    })

    // Assert - Loading should be true
    expect(result.current.loading).toBe(true)

    // Wait for completion
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })
})
```

---

## 5. Tests d'Intégration

### Test Complet du Flux

```typescript
// __tests__/integration/createRoute.integration.test.ts
import { CreateRouteUseCase } from '../../application/useCases/CreateRouteUseCase'
import { InMemoryRouteRepository } from '../mocks/InMemoryRouteRepository'
import { MockEmailService } from '../mocks/MockEmailService'

describe('Create Route - Integration Test', () => {
  it('should create and persist a complete route', async () => {
    // Arrange - Setup real use case with in-memory adapters
    const repository = new InMemoryRouteRepository()
    const emailService = new MockEmailService()
    const useCase = new CreateRouteUseCase(repository, emailService)

    const dto = {
      transporterId: 'transporter-1',
      departureCountry: 'France',
      departureCity: 'Paris',
      departureDate: '2025-01-01',
      arrivalCountry: 'Spain',
      arrivalCity: 'Madrid',
      arrivalDate: '2025-01-05',
      intermediateStops: [
        { country: 'France', city: 'Lyon', order: 0 },
      ],
      description: 'Integration test route',
      price: 15.5,
      email: 'integration@test.com',
    }

    // Act
    const result = await useCase.execute(dto)

    // Assert
    expect(result.id).toBeDefined()
    expect(result.status).toBe('DRAFT')

    // Verify persistence
    const savedRoute = await repository.findById(result.id)
    expect(savedRoute).not.toBeNull()
    expect(savedRoute!.getDeparture().getCity()).toBe('Paris')
    expect(savedRoute!.getIntermediateStops()).toHaveLength(1)

    // Verify email sent
    expect(emailService.sentEmails).toContain('integration@test.com')
  })
})
```

---

## 6. Configuration Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/domain/**/*.ts',
    'src/application/**/*.ts',
    'src/infrastructure/**/*.ts',
    'src/hooks/**/*.ts',
    '!**/__tests__/**',
    '!**/node_modules/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}
```

---

## 7. Scripts Package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:domain": "jest --testPathPattern=domain",
    "test:application": "jest --testPathPattern=application",
    "test:infrastructure": "jest --testPathPattern=infrastructure"
  }
}
```

---

## Conclusion

Avec la Clean Architecture, **100% du code métier est testable** sans dépendances externes :

- ✅ **Domain Layer** : Tests unitaires purs (aucune dépendance)
- ✅ **Application Layer** : Tests avec mocks simples (in-memory)
- ✅ **Infrastructure Layer** : Tests d'intégration ciblés
- ✅ **Presentation Layer** : Tests React avec mocks DI

**Couverture de tests visée : 80%+**
