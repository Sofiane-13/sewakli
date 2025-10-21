# Diagrammes d'Architecture Clean

## 1. Vue d'ensemble des couches

```
┌──────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                 │
│  │ Components │  │   Hooks    │  │   Context  │                 │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘                 │
│         │                │                │                       │
│         └────────────────┼────────────────┘                       │
│                          │                                        │
│                          ↓                                        │
└──────────────────────────┼────────────────────────────────────────┘
                           │
┌──────────────────────────┼────────────────────────────────────────┐
│                          ↓         APPLICATION LAYER              │
│                  ┌──────────────┐                                 │
│                  │  Use Cases   │                                 │
│                  │ ───────────  │                                 │
│                  │ CreateRoute  │                                 │
│                  │ SearchRoutes │                                 │
│                  │ PublishRoute │                                 │
│                  └──────┬───────┘                                 │
│                         │                                         │
│                  ┌──────┴───────┐                                 │
│                  │     DTOs     │                                 │
│                  └──────┬───────┘                                 │
│                         │                                         │
│                         ↓                                         │
└─────────────────────────┼─────────────────────────────────────────┘
                          │
┌─────────────────────────┼─────────────────────────────────────────┐
│                         ↓              DOMAIN LAYER               │
│              ┌──────────────────┐                                 │
│              │     Entities     │                                 │
│              │  ──────────────  │                                 │
│              │      Route       │                                 │
│              └────────┬─────────┘                                 │
│                       │                                           │
│         ┌─────────────┼─────────────┐                             │
│         ↓             ↓             ↓                             │
│  ┌────────────┐ ┌──────────┐ ┌──────────┐                        │
│  │   Value    │ │ Business │ │  Ports   │                        │
│  │  Objects   │ │  Rules   │ │(Interfaces)│                      │
│  └────────────┘ └──────────┘ └──────┬───┘                        │
│                                      │                            │
│                                      ↑                            │
└──────────────────────────────────────┼────────────────────────────┘
                                       │ (implements)
┌──────────────────────────────────────┼────────────────────────────┐
│                                      │    INFRASTRUCTURE LAYER    │
│                              ┌───────┴────────┐                   │
│                              │   Adapters     │                   │
│                              │ ────────────── │                   │
│                              │ GraphQLRepo    │                   │
│                              │ EmailService   │                   │
│                              └───────┬────────┘                   │
│                                      │                            │
│                              ┌───────┴────────┐                   │
│                              │    Mappers     │                   │
│                              └───────┬────────┘                   │
│                                      │                            │
│                              ┌───────┴────────┐                   │
│                              │   GraphQL /    │                   │
│                              │   External     │                   │
│                              └────────────────┘                   │
└──────────────────────────────────────────────────────────────────┘
```

## 2. Flux de création d'un itinéraire

```
User Action                Component               Hook                 Use Case              Domain              Repository
    │                          │                      │                      │                     │                     │
    │  Click "Publish"         │                      │                      │                     │                     │
    ├─────────────────────────>│                      │                      │                     │                     │
    │                          │                      │                      │                     │                     │
    │                          │  createRoute(dto)    │                      │                     │                     │
    │                          ├─────────────────────>│                      │                     │                     │
    │                          │                      │                      │                     │                     │
    │                          │                      │  execute(dto)        │                     │                     │
    │                          │                      ├─────────────────────>│                     │                     │
    │                          │                      │                      │                     │                     │
    │                          │                      │                      │  Route.create()     │                     │
    │                          │                      │                      ├────────────────────>│                     │
    │                          │                      │                      │                     │                     │
    │                          │                      │                      │  validate()         │                     │
    │                          │                      │                      ├────────────────────>│                     │
    │                          │                      │                      │                     │                     │
    │                          │                      │                      │  ✓ valid            │                     │
    │                          │                      │                      │<────────────────────┤                     │
    │                          │                      │                      │                     │                     │
    │                          │                      │                      │  save(route)        │                     │
    │                          │                      │                      ├─────────────────────────────────────────>│
    │                          │                      │                      │                     │                     │
    │                          │                      │                      │                     │  GraphQL Mutation  │
    │                          │                      │                      │                     │<────────────────────┤
    │                          │                      │                      │                     │                     │
    │                          │                      │                      │  ✓ saved            │                     │
    │                          │                      │                      │<─────────────────────────────────────────┤
    │                          │                      │                      │                     │                     │
    │                          │                      │  RouteDTO            │                     │                     │
    │                          │                      │<─────────────────────┤                     │                     │
    │                          │                      │                      │                     │                     │
    │                          │  RouteDTO            │                      │                     │                     │
    │                          │<─────────────────────┤                      │                     │                     │
    │                          │                      │                      │                     │                     │
    │  Navigate to success     │                      │                      │                     │                     │
    │<─────────────────────────┤                      │                      │                     │                     │
    │                          │                      │                      │                     │                     │
```

## 3. Structure détaillée par couche

### Domain Layer (Cœur Métier)

```
domain/
├── entities/
│   └── Route.ts
│       ├── create()              → Factory method
│       ├── publish()             → Business rule
│       ├── cancel()              → Business rule
│       ├── validate()            → Validation rules
│       └── getters               → Access to value objects
│
├── valueObjects/
│   ├── RouteId.ts                → Unique identifier
│   ├── Location.ts               → Country + City
│   ├── DateValue.ts              → Date with validation
│   ├── Price.ts                  → Price with constraints
│   ├── Email.ts                  → Email with validation
│   ├── Stop.ts                   → Intermediate stop
│   └── RouteStatus.ts            → Status lifecycle
│
├── services/
│   └── (Domain services here)
│
├── errors/
│   └── DomainError.ts
│       ├── InvalidRouteTransitionError
│       ├── RouteValidationError
│       └── InvalidValueObjectError
│
└── ports/
    └── IRouteRepository.ts       → Interface (contract)
        ├── save(route)
        ├── findById(id)
        ├── search(criteria)
        └── update(route)
```

### Application Layer (Use Cases)

```
application/
├── useCases/
│   ├── CreateRouteUseCase.ts
│   │   └── execute(dto: CreateRouteDTO): Promise<RouteDTO>
│   │       ├── 1. Validate input (Email, etc.)
│   │       ├── 2. Create domain entity
│   │       ├── 3. Persist via repository
│   │       └── 4. Return DTO
│   │
│   ├── SearchRoutesUseCase.ts
│   │   └── execute(dto: SearchRoutesDTO): Promise<RouteDTO[]>
│   │       ├── 1. Build criteria
│   │       ├── 2. Search via repository
│   │       ├── 3. Filter published routes
│   │       └── 4. Convert to DTOs
│   │
│   └── PublishRouteUseCase.ts
│       └── execute(routeId: string): Promise<RouteDTO>
│           ├── 1. Find route
│           ├── 2. route.publish() → Business rule
│           ├── 3. Update via repository
│           └── 4. Return DTO
│
├── dtos/
│   └── RouteDTO.ts
│       ├── CreateRouteDTO        → Input for creation
│       ├── RouteDTO              → Output representation
│       └── SearchRoutesDTO       → Search criteria
│
├── ports/
│   └── IEmailService.ts          → Email interface
│
└── errors/
    └── ApplicationError.ts
        ├── RouteCreationFailedError
        ├── RouteNotFoundError
        └── ValidationError
```

### Infrastructure Layer (Adapters)

```
infrastructure/
├── adapters/
│   ├── GraphQLRouteRepositoryNew.ts
│   │   └── implements IRouteRepository
│   │       ├── save(route)       → GraphQL mutation
│   │       ├── findById(id)      → GraphQL query
│   │       ├── search(criteria)  → GraphQL query
│   │       └── update(route)     → GraphQL mutation
│   │
│   └── GraphQLEmailService.ts
│       └── implements IEmailService
│           ├── sendVerificationCode()
│           └── verifyCode()
│
├── mappers/
│   └── RouteMapper.ts
│       ├── toDomain(graphqlResponse)  → Domain Entity
│       └── toGraphQL(route)           → GraphQL variables
│
├── graphql/
│   ├── apolloClient.ts           → Apollo configuration
│   └── operations/
│       └── route.graphql.ts      → GraphQL operations
│
├── config/
│   └── DIContainer.ts            → Dependency Injection
│       ├── routeRepository
│       ├── emailService
│       └── useCases wiring
│
└── errors/
    └── RepositoryError.ts
        ├── GraphQLError
        └── NetworkError
```

### Presentation Layer (React)

```
presentation/
├── hooks/
│   ├── useCreateRoute.new.ts
│   │   └── Thin wrapper around CreateRouteUseCase
│   │       ├── useState for loading/error
│   │       ├── getDIContainer().getCreateRouteUseCase()
│   │       └── Delegate to use case
│   │
│   └── useSearchRoutes.new.ts
│       └── Thin wrapper around SearchRoutesUseCase
│
└── components/
    └── RouteCreation.new.tsx
        └── Pure UI component
            ├── No business logic
            ├── Uses hooks for state
            └── Displays results
```

## 4. Dependency Injection Flow

```
                    DIContainer.getInstance()
                            │
                ┌───────────┴───────────┐
                │                       │
                ↓                       ↓
        ┌──────────────┐        ┌──────────────┐
        │ apolloClient │        │ emailService │
        └──────┬───────┘        └──────┬───────┘
               │                       │
               ↓                       ↓
     ┌──────────────────┐    ┌──────────────────┐
     │ routeRepository  │    │  emailService    │
     │ (GraphQL impl)   │    │  (GraphQL impl)  │
     └──────┬───────────┘    └──────┬───────────┘
            │                       │
            └───────────┬───────────┘
                        │
                        ↓
              ┌──────────────────┐
              │  Use Cases       │
              │ ──────────────── │
              │ CreateRoute      │
              │ SearchRoutes     │
              │ PublishRoute     │
              └──────┬───────────┘
                     │
                     ↓
              ┌──────────────────┐
              │     Hooks        │
              │ ──────────────── │
              │ useCreateRoute   │
              │ useSearchRoutes  │
              └──────┬───────────┘
                     │
                     ↓
              ┌──────────────────┐
              │   Components     │
              └──────────────────┘
```

## 5. Exemple Concret: Créer un itinéraire

### Ancien code (❌ Sans Clean Architecture)

```typescript
// RouteCreation.tsx (OLD)
const RouteCreation = () => {
  const repository = useRouteRepository() // Direct infrastructure access
  const [loading, setLoading] = useState(false)

  const handlePublish = async (data) => {
    setLoading(true)
    // Business logic mixed with UI
    if (!data.email.includes('@')) {
      alert('Invalid email')
      return
    }
    // Direct repository call
    await repository.createRoute(data, transporterId)
    setLoading(false)
  }
}
```

### Nouveau code (✅ Avec Clean Architecture)

```typescript
// 1. Domain Entity (domain/entities/Route.ts)
class Route {
  static create(params) {
    const route = new Route(...)
    route.validate() // Business rules
    return route
  }
}

// 2. Use Case (application/useCases/CreateRouteUseCase.ts)
class CreateRouteUseCase {
  async execute(dto: CreateRouteDTO) {
    const email = Email.create(dto.email) // Validation
    const route = Route.create(dto)       // Domain entity
    await this.repository.save(route)     // Persistence
    return this.toDTO(route)              // DTO
  }
}

// 3. Hook (hooks/useCreateRoute.new.ts)
const useCreateRouteNew = () => {
  const useCase = getDIContainer().getCreateRouteUseCase()
  const createRoute = (dto) => useCase.execute(dto) // Delegate
  return { createRoute }
}

// 4. Component (components/RouteCreation.new.tsx)
const RouteCreationNew = () => {
  const { createRoute } = useCreateRouteNew()
  const handlePublish = (data) => {
    const dto: CreateRouteDTO = { ...data } // Build DTO
    await createRoute(dto)                   // Delegate
  }
}
```

## 6. Avantages Visuels

```
┌─────────────────────────────────────────────────────────────┐
│                    AVANT (Sans Clean Arch)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Component ──> Hook ──> Repository ──> GraphQL              │
│     │                                                       │
│     └──> Business Logic (mixed everywhere)                 │
│                                                             │
│  Problems:                                                  │
│  - Business logic in UI                                    │
│  - Cannot test without React                               │
│  - Cannot change GraphQL easily                            │
│  - Tight coupling                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 APRÈS (Avec Clean Arch)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Component ──> Hook ──> Use Case ──> Domain ←─ Repository  │
│   (UI only)  (State)  (Orchestration) (Rules)  (Adapter)   │
│                                                             │
│  Benefits:                                                  │
│  ✓ Business logic in Domain                                │
│  ✓ Testable without React                                  │
│  ✓ Can swap GraphQL for REST                               │
│  ✓ Loose coupling                                          │
│  ✓ Clear responsibilities                                  │
└─────────────────────────────────────────────────────────────┘
```

---

**Légende:**
- `→` : Dépendance directe
- `←` : Implémentation d'interface
- `↓` : Flux de données
