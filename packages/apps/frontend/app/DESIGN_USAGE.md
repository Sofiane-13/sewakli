# Guide d'Utilisation du Design System Sakherli

## Introduction

Ce guide vous montre comment utiliser le design system Sakherli dans vos composants React.

## Import des Composants

```tsx
// Composants UI de base
import { Button } from './components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/Card'
import { Badge } from './components/ui/Badge'
import { Input } from './components/ui/Input'
import { Container } from './components/ui/Container'

// Composants métier
import { RouteCard } from './components/business/RouteCard'
import { StatsCard } from './components/business/StatsCard'
import { FeatureCard } from './components/business/FeatureCard'

// Utilitaires
import { cn } from './lib/utils'
```

## Exemples d'Utilisation

### Boutons

```tsx
// Bouton principal
<Button variant="primary" size="lg">
  Rechercher
</Button>

// Bouton avec icône
<Button
  variant="secondary"
  leftIcon={<span className="material-symbols-outlined">add</span>}
>
  Ajouter
</Button>

// Bouton en chargement
<Button variant="primary" isLoading>
  Enregistrement...
</Button>

// Bouton pleine largeur
<Button variant="primary" fullWidth>
  Continuer
</Button>
```

### Cards

```tsx
// Card de base
<Card>
  <p>Contenu de la carte</p>
</Card>

// Card avec effet hover
<Card hover>
  <p>Survolez-moi</p>
</Card>

// Card interactive (cliquable)
<Card interactive onClick={() => console.log('Cliqué!')}>
  <p>Cliquez-moi</p>
</Card>

// Card avec header et contenu
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Contenu ici</p>
  </CardContent>
</Card>
```

### Badges

```tsx
// Badge de statut
<Badge variant="success">
  <span className="material-symbols-outlined text-sm">check_circle</span>
  Disponible
</Badge>

<Badge variant="warning" size="sm">
  En attente
</Badge>

<Badge variant="error">
  Annulé
</Badge>
```

### Input

```tsx
// Input simple
<Input
  label="Email"
  placeholder="votre@email.com"
  type="email"
/>

// Input avec icône
<Input
  label="Recherche"
  placeholder="Rechercher..."
  leftIcon={<span className="material-symbols-outlined">search</span>}
/>

// Input avec erreur
<Input
  label="Téléphone"
  error
  helperText="Numéro invalide"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
/>
```

### Container

```tsx
// Container standard
<Container>
  <h1>Mon contenu</h1>
</Container>

// Container de taille personnalisée
<Container size="sm">
  <p>Contenu plus étroit</p>
</Container>
```

### RouteCard (Composant Métier)

```tsx
<RouteCard
  departureCity="Paris"
  departureCountry="France"
  departureDate="2025-02-01"
  arrivalCity="Berlin"
  arrivalCountry="Allemagne"
  arrivalDate="2025-02-02"
  transporterName="TransEuro Express"
  price={150}
  currency="€"
  capacity="10 tonnes"
  status="available"
  onContact={() => console.log('Contact transporteur')}
  onViewDetails={() => console.log('Voir détails')}
/>
```

### StatsCard

```tsx
<StatsCard
  title="Trajets réalisés"
  value="10,234"
  icon="local_shipping"
  variant="primary"
  trend={{
    value: 12.5,
    isPositive: true
  }}
/>
```

### FeatureCard

```tsx
<FeatureCard
  icon="verified"
  title="Transporteurs Vérifiés"
  description="Tous nos transporteurs sont certifiés"
  variant="primary"
/>
```

## Utilisation des Couleurs Tailwind

```tsx
// Backgrounds
<div className="bg-primary-500">Fond bleu primaire</div>
<div className="bg-secondary-500">Fond orange secondaire</div>
<div className="bg-neutral-100 dark:bg-neutral-800">Fond adaptatif</div>

// Textes
<p className="text-primary-600">Texte bleu</p>
<p className="text-neutral-900 dark:text-neutral-50">Texte adaptatif</p>
<h1 className="text-gradient-primary">Texte avec gradient</h1>

// Bordures
<div className="border border-neutral-200 dark:border-neutral-700">
  Bordure adaptative
</div>
```

## Responsive Design

```tsx
// Taille de texte responsive
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  Grand titre
</h1>

// Grid responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
  <Card>Item 4</Card>
</div>

// Masquer/Afficher selon la taille
<div className="hidden md:block">Visible uniquement sur desktop</div>
<div className="md:hidden">Visible uniquement sur mobile</div>
```

## Icônes Material Symbols

```tsx
// Icône outline (par défaut)
<span className="material-symbols-outlined text-2xl text-primary-600">
  local_shipping
</span>

// Icône filled
<span className="material-symbols-filled text-xl text-success-600">
  verified
</span>

// Icônes courantes
search           // Recherche
add_circle       // Ajouter
local_shipping   // Transport/Camion
flight_takeoff   // Départ
flight_land      // Arrivée
verified         // Vérifié
schedule         // Horaire
payments         // Paiement
support_agent    // Support
person           // Profil
mail             // Email
phone            // Téléphone
location_on      // Localisation
```

## Animations & Transitions

```tsx
// Hover avec translation
<div className="transition-all hover:-translate-y-1 hover:shadow-lg">
  Survolez-moi
</div>

// Effet actif
<button className="active:scale-95 transition-transform">
  Cliquez-moi
</button>

// Durées personnalisées
<div className="transition-colors duration-fast">Rapide</div>
<div className="transition-all duration-base">Normal</div>
<div className="transition-opacity duration-slow">Lent</div>
```

## Classes Utilitaires Personnalisées

```css
/* Container personnalisé */
<div className="container-custom">
  Largeur max avec padding responsive
</div>

/* Effet hover sur carte */
<Card className="card-hover">
  Hover avec shadow et translation
</Card>

/* Overlay gradient */
<div className="gradient-overlay-dark">
  Overlay noir dégradé
</div>

<div className="gradient-overlay-brand">
  Overlay bleu dégradé
</div>

/* Scrollbar fine */
<div className="scrollbar-thin overflow-auto">
  Scrollbar stylisée
</div>
```

## Combinaison avec cn()

```tsx
import { cn } from './lib/utils'

// Merger des classes conditionnellement
<Button
  className={cn(
    'custom-class',
    isActive && 'bg-primary-700',
    isDisabled && 'opacity-50 cursor-not-allowed'
  )}
>
  Bouton dynamique
</Button>
```

## Layout Patterns

### Page Standard

```tsx
<div className="flex flex-col min-h-screen">
  <Header />

  <main className="flex-grow">
    <Container>
      {/* Contenu */}
    </Container>
  </main>

  <Footer />
</div>
```

### Hero Section

```tsx
<section className="relative min-h-[600px] bg-gradient-to-br from-primary-500 to-primary-700">
  <Container className="relative z-10 py-20">
    <h1 className="text-5xl font-bold text-white mb-6">
      Titre Principal
    </h1>
    <p className="text-xl text-white/90 mb-8">
      Sous-titre explicatif
    </p>
    <Button variant="secondary" size="lg">
      Appel à l'action
    </Button>
  </Container>
</section>
```

### Grid de Cartes

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => (
    <Card key={item.id} hover interactive>
      <CardHeader>
        <CardTitle>{item.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{item.description}</p>
      </CardContent>
    </Card>
  ))}
</div>
```

## Bonnes Pratiques

### ✅ À Faire

```tsx
// Utiliser les composants
<Button variant="primary">Valider</Button>

// Utiliser les tokens Tailwind
<div className="bg-primary-500 text-white p-4 rounded-lg">

// Penser dark mode
<p className="text-neutral-900 dark:text-neutral-50">

// Utiliser cn() pour merger les classes
<Card className={cn('custom-class', condition && 'extra-class')}>
```

### ❌ À Éviter

```tsx
// Éviter les styles inline
<button style={{ backgroundColor: '#0069D7' }}>

// Éviter les valeurs hardcodées
<div className="bg-[#0069D7]">

// Éviter d'oublier le dark mode
<p className="text-gray-900"> {/* Illisible en dark mode */}

// Éviter de dupliquer le code
// Créer un composant réutilisable à la place
```

## Accessibilité

```tsx
// Toujours des labels pour les inputs
<Input label="Email" />

// Alt text pour les images
<img src="..." alt="Description" />

// Aria labels pour les icônes
<button aria-label="Rechercher">
  <span className="material-symbols-outlined">search</span>
</button>

// Focus visible
<Button className="focus:ring-2 focus:ring-primary-500">
```

## Performance

```tsx
// Lazy loading des composants
const Dashboard = lazy(() => import('./pages/Dashboard'))

// Memoization pour composants lourds
const RouteList = memo(({ routes }) => (
  <div>
    {routes.map(route => (
      <RouteCard key={route.id} {...route} />
    ))}
  </div>
))
```

---

**Besoin d'aide ?** Consultez `DESIGN_SYSTEM.md` pour plus de détails sur chaque composant.
