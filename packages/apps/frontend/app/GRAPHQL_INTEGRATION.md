# GraphQL Integration - Clean Architecture

Ce document explique comment l'intégration GraphQL a été mise en place dans le frontend en respectant les principes de la Clean Architecture.

## Architecture

L'architecture suit le pattern hexagonal (Ports & Adapters) :

```
src/
├── domain/
│   └── ports/
│       └── IRouteRepository.ts          # Port de sortie (interface)
├── infrastructure/
│   ├── adapters/
│   │   └── GraphQLRouteRepository.ts    # Adapter GraphQL (implémentation)
│   └── graphql/
│       ├── apolloClient.ts              # Configuration Apollo Client
│       └── operations/
│           └── route.graphql.ts         # Queries & Mutations GraphQL
├── hooks/
│   ├── useRouteRepository.ts            # Hook pour instancier le repository
│   ├── useCreateRoute.ts                # Hook métier - Création de route
│   ├── useSearchRoutes.ts               # Hook métier - Recherche de routes
│   ├── useGetAllRoutes.ts               # Hook métier - Récupération de toutes les routes
│   └── useRouteActions.ts               # Hook métier - Actions sur les routes
└── components/
    └── RouteCreation.tsx                # Composant utilisant les hooks
```

## Principes de la Clean Architecture

### 1. Séparation des couches

- **Domain (Ports)** : Définit les interfaces métier (`IRouteRepository`)
- **Infrastructure (Adapters)** : Implémente les interfaces avec GraphQL
- **Application (Hooks)** : Fournit la logique métier réutilisable
- **Présentation (Components)** : Utilise les hooks sans connaître GraphQL

### 2. Inversion de dépendance

Les composants dépendent des **abstractions** (hooks métier) et non des implémentations (GraphQL).

```typescript
// ✅ BON - Le composant ne sait pas que c'est GraphQL
const { createRoute, loading, error } = useCreateRoute()

// ❌ MAUVAIS - Le composant utilise directement Apollo
const [createRoute] = useMutation(CREATE_ROUTE)
```

### 3. Testabilité

Chaque couche peut être testée indépendamment :

- **Ports** : Tests unitaires sur les interfaces
- **Adapters** : Tests d'intégration avec mocks GraphQL
- **Hooks** : Tests avec des repository mockés
- **Components** : Tests avec des hooks mockés

## Installation

Les dépendances GraphQL ont déjà été installées :

```bash
# Dependencies
@apollo/client
graphql

# Dev Dependencies
@graphql-codegen/cli
@graphql-codegen/client-preset
@graphql-codegen/typescript
@graphql-codegen/typescript-operations
@graphql-codegen/typescript-react-apollo
```

**Note importante** : Pour Apollo Client v4.0.7, `ApolloProvider` doit être importé depuis `@apollo/client/react` et non depuis `@apollo/client` directement.

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env` :

```env
VITE_GRAPHQL_API_URL=http://localhost:3000/graphql
```

### 2. Apollo Client

Le client Apollo est configuré dans [apolloClient.ts](src/infrastructure/graphql/apolloClient.ts) avec :

- Cache in-memory
- Politique de fetch : `network-only` pour les queries, `cache-and-network` pour les watchQueries
- Gestion des erreurs : `errorPolicy: 'all'`

### 3. GraphQL Code Generator (optionnel)

Pour générer automatiquement les types TypeScript depuis le schéma GraphQL :

```bash
# Générer les types une fois
pnpm codegen

# Générer les types en mode watch
pnpm codegen:watch
```

**Note** : Le code generator nécessite que le serveur GraphQL soit démarré sur `http://localhost:3000/graphql`.

## Utilisation

### Hooks disponibles

#### 1. `useCreateRoute` - Créer une route

```typescript
import { useCreateRoute } from '../hooks/useCreateRoute'

const MyComponent = () => {
  const { createRoute, loading, error, data } = useCreateRoute()

  const handleCreate = async () => {
    try {
      const route = await createRoute(
        {
          departureCountry: 'France',
          departureCity: 'Paris',
          departureDate: '2025-01-20',
          arrivalCountry: 'Algérie',
          arrivalCity: 'Alger',
          arrivalDate: '2025-01-21',
          intermediateStops: [],
          description: 'Transport de marchandises',
          price: '1500',
        },
        'transporter-id-123',
      )
      console.log('Route créée:', route)
    } catch (err) {
      console.error('Erreur:', err)
    }
  }

  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? 'Création...' : 'Créer une route'}
    </button>
  )
}
```

#### 2. `useSearchRoutes` - Rechercher des routes

```typescript
import { useSearchRoutes } from '../hooks/useSearchRoutes'

const MyComponent = () => {
  const { searchRoutes, loading, data, error } = useSearchRoutes()

  const handleSearch = async () => {
    await searchRoutes({
      departureCountry: 'France',
      arrivalCountry: 'Algérie',
    })
  }

  return (
    <div>
      <button onClick={handleSearch}>Rechercher</button>
      {loading && <p>Chargement...</p>}
      {data.map((route) => (
        <div key={route.id}>{route.departureCity}</div>
      ))}
    </div>
  )
}
```

#### 3. `useGetAllRoutes` - Récupérer toutes les routes

```typescript
import { useGetAllRoutes } from '../hooks/useGetAllRoutes'

const MyComponent = () => {
  const { routes, loading, error, refetch } = useGetAllRoutes()

  if (loading) return <p>Chargement...</p>
  if (error) return <p>Erreur: {error.message}</p>

  return (
    <div>
      {routes.map((route) => (
        <div key={route.id}>{route.departureCity}</div>
      ))}
    </div>
  )
}
```

#### 4. `useRouteActions` - Actions sur les routes

```typescript
import { useRouteActions } from '../hooks/useRouteActions'

const MyComponent = () => {
  const { publishRoute, cancelRoute, completeRoute, loading, error } =
    useRouteActions()

  return (
    <div>
      <button onClick={() => publishRoute('route-id')} disabled={loading}>
        Publier
      </button>
      <button onClick={() => cancelRoute('route-id')} disabled={loading}>
        Annuler
      </button>
      <button onClick={() => completeRoute('route-id')} disabled={loading}>
        Terminer
      </button>
    </div>
  )
}
```

## Opérations GraphQL disponibles

Toutes les opérations GraphQL sont définies dans [route.graphql.ts](src/infrastructure/graphql/operations/route.graphql.ts) :

### Queries

- `GetRoute($id: String!)` - Récupérer une route par ID
- `GetAllRoutes` - Récupérer toutes les routes
- `SearchRoutes($input: SearchRouteInput!)` - Rechercher des routes
- `GetRoutesByTransporter($transporterId: String!)` - Routes d'un transporteur

### Mutations

- `CreateRoute($input: CreateRouteInput!)` - Créer une route
- `PublishRoute($id: String!)` - Publier une route
- `CancelRoute($id: String!)` - Annuler une route
- `CompleteRoute($id: String!)` - Terminer une route

## Ajouter un nouveau hook

Pour ajouter un nouveau hook métier :

1. **Ajouter la méthode dans le port** (`IRouteRepository.ts`)

```typescript
export interface IRouteRepository {
  // ... méthodes existantes
  deleteRoute(id: string): Promise<void>
}
```

2. **Implémenter dans l'adapter** (`GraphQLRouteRepository.ts`)

```typescript
async deleteRoute(id: string): Promise<void> {
  await this.apolloClient.mutate({
    mutation: DELETE_ROUTE,
    variables: { id },
  })
}
```

3. **Créer le hook métier**

```typescript
// src/hooks/useDeleteRoute.ts
export const useDeleteRoute = () => {
  const repository = useRouteRepository()
  // ... logique du hook
}
```

4. **Utiliser dans les composants**

```typescript
const { deleteRoute, loading } = useDeleteRoute()
```

## Avantages de cette architecture

1. **Découplage** : Les composants ne dépendent pas d'Apollo/GraphQL
2. **Testabilité** : Chaque couche peut être testée séparément
3. **Maintenabilité** : Facile de changer d'implémentation (REST, gRPC, etc.)
4. **Réutilisabilité** : Les hooks métier sont réutilisables
5. **Type-safety** : TypeScript garantit la cohérence des types

## Migration future

Si vous souhaitez migrer vers une autre technologie (REST, gRPC, etc.) :

1. Gardez les **ports** (interfaces) inchangés
2. Créez un nouvel **adapter** (ex: `RESTRouteRepository`)
3. Modifiez `useRouteRepository` pour utiliser le nouvel adapter
4. Les **hooks métier** et **composants** restent inchangés !

## TODO

- [ ] Ajouter la gestion de l'authentification (JWT tokens)
- [ ] Implémenter le context utilisateur pour récupérer automatiquement le `transporterId`
- [ ] Ajouter des tests unitaires pour les hooks
- [ ] Ajouter des tests d'intégration pour les adapters
- [ ] Gérer le cache Apollo de manière optimale (normalization)
- [ ] Ajouter les subscriptions GraphQL pour les mises à jour en temps réel
