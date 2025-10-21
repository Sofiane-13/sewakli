/**
 * Application-wide constants
 */

/**
 * Asset paths for images and media
 */
export const ASSETS = {
  backgrounds: {
    home: '/algeria.png',
    form: '/formitin.png',
  },
} as const

/**
 * Temporary/mock IDs used during development
 * @deprecated These should be replaced with real IDs from authentication context
 */
export const TEMP_IDS = {
  transporter: 'temp-transporter-id',
} as const

/**
 * Route paths for navigation
 */
export const ROUTES = {
  home: '/',
  searchResults: '/search-results',
  createRoute: '/create-route',
  routeCreated: '/route-created',
} as const

/**
 * API endpoints and configuration
 */
export const API = {
  graphqlUrl:
    import.meta.env.VITE_GRAPHQL_API_URL || 'http://localhost:3000/graphql',
} as const

/**
 * Form validation patterns
 */
export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  verificationCode: {
    length: 6,
    pattern: /^\d{6}$/,
    message: 'Verification code must be 6 digits',
  },
} as const

/**
 * UI Configuration
 */
export const UI = {
  overlay: {
    opacity: 0.7, // For background overlays
  },
  animation: {
    duration: 300, // Default animation duration in ms
  },
} as const

/**
 * Storage keys for localStorage/sessionStorage
 */
export const STORAGE_KEYS = {
  language: 'language',
  theme: 'theme',
} as const

/**
 * Route status values
 */
export const ROUTE_STATUS = {
  draft: 'DRAFT',
  published: 'PUBLISHED',
  cancelled: 'CANCELLED',
  completed: 'COMPLETED',
} as const

export type RouteStatus = (typeof ROUTE_STATUS)[keyof typeof ROUTE_STATUS]
