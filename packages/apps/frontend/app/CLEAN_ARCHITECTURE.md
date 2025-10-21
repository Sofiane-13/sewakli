# Clean Architecture - Frontend Application

## Vue d'ensemble

Cette application frontend suit les principes de **Clean Architecture** (Architecture Hexagonale) pour garantir :
- ✅ **Indépendance du framework** : La logique métier ne dépend pas de React
- ✅ **Testabilité** : Chaque couche peut être testée indépendamment
- ✅ **Maintenabilité** : Code organisé en couches avec responsabilités claires
- ✅ **Évolutivité** : Facile d'ajouter de nouvelles fonctionnalités ou de changer d'infrastructure

## Architecture des Couches

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│  (React Components, Hooks, UI)                              │
│  src/components/, src/hooks/                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  (Use Cases, DTOs, Application Services)                    │
│  src/application/useCases/, src/application/dtos/           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                             │
│  (Entities, Value Objects, Domain Rules, Interfaces)        │
│  src/domain/entities/, src/domain/valueObjects/             │
└─────────────────────────────────────────────────────────────┘
                     ↑
                     │
┌────────────────────┴────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                         │
│  (Adapters, GraphQL, External Services)                     │
│  src/infrastructure/adapters/, src/infrastructure/graphql/  │
└─────────────────────────────────────────────────────────────┘
```

## Structure des Dossiers

```
src/
├── domain/                          # DOMAIN LAYER
│   ├── entities/                    # Entités du domaine
│   │   └── Route.ts                 # Entité Route avec règles métier
│   ├── valueObjects/                # Value Objects immuables
│   │   ├── RouteId.ts
│   │   ├── Location.ts
│   │   ├── DateValue.ts
│   │   ├── Price.ts
│   │   ├── Email.ts
│   │   ├── Stop.ts
│   │   └── RouteStatus.ts
│   ├── services/                    # Services du domaine
│   ├── errors/                      # Erreurs du domaine
│   │   └── DomainError.ts
│   └── ports/                       # Interfaces (contrats)
│       └── IRouteRepository.new.ts
│
├── application/                     # APPLICATION LAYER
│   ├── useCases/                    # Cas d'utilisation
│   │   ├── CreateRouteUseCase.ts
│   │   ├── SearchRoutesUseCase.ts
│   │   ├── GetAllRoutesUseCase.ts
│   │   └── PublishRouteUseCase.ts
│   ├── dtos/                        # Data Transfer Objects
│   │   └── RouteDTO.ts
│   ├── ports/                       # Interfaces applicatives
│   │   └── IEmailService.ts
│   └── errors/                      # Erreurs applicatives
│       └── ApplicationError.ts
│
├── infrastructure/                  # INFRASTRUCTURE LAYER
│   ├── adapters/                    # Adaptateurs (implémentations)
│   │   ├── GraphQLRouteRepositoryNew.ts
│   │   └── GraphQLEmailService.ts
│   ├── graphql/                     # Configuration GraphQL
│   │   └── apolloClient.ts
│   ├── mappers/                     # Mappers domain ↔ infrastructure
│   │   └── RouteMapper.ts
│   ├── errors/                      # Erreurs infrastructure
│   │   └── RepositoryError.ts
│   └── config/                      # Configuration
│       └── DIContainer.ts           # Injection de dépendances
│
├── hooks/                           # PRESENTATION LAYER (Hooks)
│   ├── useCreateRoute.new.ts
│   ├── useSearchRoutes.new.ts
│   └── useGetAllRoutes.new.ts
│
└── components/                      # PRESENTATION LAYER (Components)
    ├── RouteCreation.tsx
    ├── SearchResults.tsx
    └── ...
```

## Principes Clés

### 1. Flux de Dépendances

**Règle d'or** : Les dépendances pointent TOUJOURS vers l'intérieur (vers le domaine)

```
Presentation → Application → Domain ← Infrastructure
```

- ❌ Le domaine NE DOIT JAMAIS dépendre de l'infrastructure
- ❌ Le domaine NE DOIT JAMAIS dépendre de React
- ✅ L'infrastructure implémente les interfaces définies dans le domaine
- ✅ Les use cases orchestrent la logique métier

### 2. Couche Domain (Cœur Métier)

**Contient :**
- **Entités** : Objets avec identité et cycle de vie (ex: `Route`)
- **Value Objects** : Objets immuables définis par leurs valeurs (ex: `Location`, `Price`)
- **Règles métier** : Validation et transitions d'état
- **Interfaces** : Contrats pour les repositories et services

**Exemple - Entité Route :**
```typescript
class Route {
  // Règle métier : Publier un itinéraire
  publish(): void {
    if (!this.status.canBePublished()) {
      throw new InvalidRouteTransitionError(
        this.status.toString(),
        RouteStatus.PUBLISHED
      )
    }
    this.status = RouteStatusValue.published()
  }
}
```

### 3. Couche Application (Use Cases)

**Contient :**
- **Use Cases** : Scénarios d'utilisation métier
- **DTOs** : Objets de transfert de données
- **Orchestration** : Coordination entre domaine et infrastructure

**Exemple - CreateRouteUseCase :**
```typescript
class CreateRouteUseCase {
  constructor(
    private routeRepository: IRouteRepository,
    private emailService: IEmailService
  ) {}

  async execute(dto: CreateRouteDTO): Promise<RouteDTO> {
    // 1. Valider les données
    const email = Email.create(dto.email)

    // 2. Créer l'entité domaine
    const route = Route.create({ ... })

    // 3. Persister via repository
    await this.routeRepository.save(route)

    // 4. Retourner DTO
    return this.toDTO(route)
  }
}
```

### 4. Couche Infrastructure (Adaptateurs)

**Contient :**
- **Adapters** : Implémentations concrètes des interfaces
- **Mappers** : Conversion entre domaine et formats externes
- **Configuration** : Setup GraphQL, DI, etc.

**Exemple - Repository :**
```typescript
class GraphQLRouteRepositoryNew implements IRouteRepository {
  async save(route: Route): Promise<void> {
    const mutation = gql`...`
    await this.apolloClient.mutate({ mutation, variables })
  }
}
```

### 5. Couche Presentation (React)

**Contient :**
- **Hooks** : Gestion d'état React (délègue aux use cases)
- **Components** : UI pure sans logique métier

**Exemple - Hook :**
```typescript
export const useCreateRouteNew = () => {
  const [loading, setLoading] = useState(false)
  const createRouteUseCase = getDIContainer().getCreateRouteUseCase()

  const createRoute = async (data: CreateRouteDTO) => {
    setLoading(true)
    // Délègue au use case - PAS de logique métier ici
    const result = await createRouteUseCase.execute(data)
    setLoading(false)
    return result
  }

  return { createRoute, loading }
}
```

## Injection de Dépendances (DI)

Le **DIContainer** gère toutes les dépendances :

```typescript
// infrastructure/config/DIContainer.ts
class DIContainer {
  private routeRepository: IRouteRepository
  private createRouteUseCase: CreateRouteUseCase

  constructor() {
    // Wire dependencies
    this.routeRepository = new GraphQLRouteRepositoryNew(apolloClient)
    this.createRouteUseCase = new CreateRouteUseCase(
      this.routeRepository,
      this.emailService
    )
  }

  getCreateRouteUseCase(): CreateRouteUseCase {
    return this.createRouteUseCase
  }
}
```

**Utilisation dans un composant :**
```typescript
import { getDIContainer } from '../infrastructure/config/DIContainer'

const MyComponent = () => {
  const useCase = getDIContainer().getCreateRouteUseCase()
  // ...
}
```

## Gestion des Erreurs

Erreurs stratifiées par couche :

```typescript
// Domain errors
throw new RouteValidationError('Arrival must be after departure')

// Application errors
throw new RouteCreationFailedError('Failed to create route')

// Infrastructure errors
throw new GraphQLError('Network request failed')
```

## Migration Progressive

Pour migrer l'ancien code vers la Clean Architecture :

1. **Garder l'ancien code fonctionnel** (fichiers `.old.ts`)
2. **Créer nouveaux fichiers** avec `.new.ts`
3. **Tester la nouvelle architecture** indépendamment
4. **Basculer progressivement** composant par composant
5. **Supprimer l'ancien code** une fois migration complète

**Exemple :**
- `useCreateRoute.ts` (ancien)
- `useCreateRoute.new.ts` (nouveau avec Clean Arch)

## Avantages de cette Architecture

### ✅ Testabilité
```typescript
// Test du use case sans React ni GraphQL
const mockRepo = new InMemoryRouteRepository()
const useCase = new CreateRouteUseCase(mockRepo, mockEmailService)
const result = await useCase.execute(dto)
expect(result.id).toBeDefined()
```

### ✅ Changement de Framework
- Remplacer React par Vue/Angular : seule la couche Presentation change
- Remplacer GraphQL par REST : seule l'Infrastructure change
- **Le domaine et l'application restent identiques**

### ✅ Règles Métier Centralisées
```typescript
// Règle : Un itinéraire ne peut être publié que s'il est en statut DRAFT
route.publish() // ✅ Validation automatique
```

### ✅ Séparation des Préoccupations
- **Domain** : Que peut faire l'application ?
- **Application** : Comment orchestrer les actions ?
- **Infrastructure** : Comment communiquer avec l'extérieur ?
- **Presentation** : Comment afficher à l'utilisateur ?

## Commandes Utiles

```bash
# Vérifier la structure
tree src/ -I node_modules

# Lancer l'application
npm run dev

# Tests (à implémenter)
npm run test
```

## Points d'Attention

⚠️ **Ne pas mélanger les couches**
- Pas de `import { apolloClient }` dans les components
- Pas de `useState` dans les use cases
- Pas de règles métier dans les hooks

⚠️ **Toujours passer par le DI Container**
```typescript
// ❌ Mauvais
const repo = new GraphQLRouteRepository(apolloClient)

// ✅ Bon
const useCase = getDIContainer().getCreateRouteUseCase()
```

⚠️ **Utiliser les Value Objects**
```typescript
// ❌ Mauvais
const price = 10.50

// ✅ Bon
const price = Price.create(10.50)
```

## Ressources

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)

---

**Auteur :** Clean Architecture Refactoring
**Date :** 2025
**Version :** 1.0.0
