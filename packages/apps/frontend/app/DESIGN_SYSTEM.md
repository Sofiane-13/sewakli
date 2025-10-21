# Translink Express - Design System

## Vue d'ensemble

Le design system de Translink Express est conçu pour créer une expérience utilisateur professionnelle et cohérente pour une plateforme de mise en relation entre transporteurs et clients.

## Charte Graphique

### Identité Visuelle

- **Logo** : Icône de camion (local_shipping) sur fond dégradé bleu
- **Tagline** : "Connecter transporteurs & clients"
- **Positionnement** : Plateforme professionnelle de transport et logistique

### Palette de Couleurs

#### Couleurs Principales

**Primary (Bleu)** - Confiance & Fiabilité
- `primary-500` : #0F66BD (couleur principale)
- Variations : 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

**Secondary (Orange)** - Énergie & Action
- `secondary-500` : #FF6B35 (couleur secondaire)
- Variations : 50, 100, 200, 300, 400, 500, 600, 700, 800, 900

#### Couleurs Fonctionnelles

- **Success** : #10B981 (vert) - Validations et confirmations
- **Warning** : #F59E0B (jaune/orange) - Alertes et avertissements
- **Error** : #EF4444 (rouge) - Erreurs et dangers
- **Neutral** : Échelle de gris (50-950) - Textes et backgrounds

### Typographie

**Police principale** : Plus Jakarta Sans

#### Tailles de Texte
- `xs` : 12px
- `sm` : 14px
- `base` : 16px
- `lg` : 18px
- `xl` : 20px
- `2xl` : 24px
- `3xl` : 30px
- `4xl` : 36px
- `5xl` : 48px
- `6xl` : 60px

#### Poids
- Light (300)
- Normal (400)
- Medium (500)
- Semibold (600)
- Bold (700)
- Extrabold (800)

## Composants UI

### Button

Bouton avec plusieurs variantes et tailles.

**Variantes** :
- `primary` : Bouton principal avec dégradé bleu
- `secondary` : Bouton secondaire avec dégradé orange
- `outline` : Bouton avec bordure sans fond
- `ghost` : Bouton transparent
- `destructive` : Bouton rouge pour actions dangereuses
- `success` : Bouton vert pour confirmations

**Exemple** :
```tsx
<Button variant="primary" size="lg" leftIcon={<Icon name="search" />}>
  Rechercher
</Button>
```

### Card

Carte avec effets de verre et variations.

**Variantes** :
- `default` : Carte standard
- `elevated` : Carte avec ombre importante
- `glass` : Effet de verre avec flou
- `bordered` : Carte avec bordure épaisse

**Exemple** :
```tsx
<Card variant="glass" hoverable>
  <CardHeader icon={<Icon name="check" />}>
    <CardTitle>Titre</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Contenu</CardContent>
  <CardFooter>Pied de page</CardFooter>
</Card>
```

### Badge

Petit label pour afficher du statut.

**Exemple** :
```tsx
<Badge variant="success" icon={<Icon name="verified" />}>
  Vérifié
</Badge>
```

### Input

Champ de saisie avec label et icônes.

**Exemple** :
```tsx
<Input
  label="Email"
  type="email"
  leftIcon={<Icon name="mail" />}
  error="Email invalide"
/>
```

### Icon

Icônes Material Symbols.

**Exemple** :
```tsx
<Icon name="local_shipping" size="lg" filled />
```

### Container

Conteneur responsive.

**Exemple** :
```tsx
<Container size="lg" centered>
  Contenu
</Container>
```

## Classes Utilitaires

### Glass Effect
```tsx
className="glass glass-border"
```

### Gradients
```tsx
className="text-gradient"
className="bg-gradient-primary"
className="bg-gradient-secondary"
```

## Mode Sombre

Tous les composants supportent le dark mode via la classe `dark:`.

## Structure des Fichiers

```
src/
├── design/
│   └── tokens.ts
├── components/
│   ├── ui/
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Container.tsx
│   │   ├── Divider.tsx
│   │   ├── Icon.tsx
│   │   └── Input.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Home.tsx
└── index.css
```
