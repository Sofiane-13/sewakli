import { RouteInMemory } from './RouteInMemory'
import { Route, RouteStatus } from '../../domain/model/Route'
import { CreateIntermediateStop } from '../../domain/model/IntermediateStop'

describe('RouteInMemory - Superset Route Search', () => {
  let repository: RouteInMemory
  let baseRoute: Route
  let supersetRoute: Route

  beforeEach(() => {
    repository = new RouteInMemory()
  })

  afterEach(() => {
    repository.clear()
  })

  describe('search with superset detection', () => {
    beforeEach(async () => {
      // Create a base route: Paris -> Lyon
      baseRoute = new Route({
        departureCountry: 'France',
        departureCity: 'Paris',
        departureDate: new Date('2025-06-01T08:00:00Z'),
        arrivalCountry: 'France',
        arrivalCity: 'Lyon',
        arrivalDate: new Date('2025-06-01T12:00:00Z'),
        intermediateStops: [],
        description: 'Basic route Paris to Lyon',
        price: 50,
        transporterId: 'transporter-1',
      })

      // Publish the route
      baseRoute = baseRoute.publish()

      // Create a superset route: Paris -> Marseille (with stop in Lyon)
      const lyonStop: CreateIntermediateStop = {
        country: 'France',
        city: 'Lyon',
        date: new Date('2025-06-01T12:00:00Z'),
      }

      supersetRoute = new Route({
        departureCountry: 'France',
        departureCity: 'Paris',
        departureDate: new Date('2025-06-01T08:00:00Z'),
        arrivalCountry: 'France',
        arrivalCity: 'Marseille',
        arrivalDate: new Date('2025-06-01T16:00:00Z'),
        intermediateStops: [lyonStop],
        description: 'Extended route Paris to Marseille via Lyon',
        price: 80,
        transporterId: 'transporter-1',
      })

      // Publish the superset route
      supersetRoute = supersetRoute.publish()

      await repository.save(baseRoute)
      await repository.save(supersetRoute)
    })

    it('should return both exact match and superset route when searching Paris -> Lyon', async () => {
      const results = await repository.search({
        departureCountry: 'France',
        departureCity: 'Paris',
        arrivalCountry: 'France',
        arrivalCity: 'Lyon',
        departureDate: new Date('2025-06-01T08:00:00Z'),
        arrivalDate: new Date('2025-06-01T12:00:00Z'),
      })

      expect(results).toHaveLength(2)
      expect(results.map((r) => r.id)).toContain(baseRoute.id) // exact match
      expect(results.map((r) => r.id)).toContain(supersetRoute.id) // superset
    })

    it('should return only superset when searching Lyon -> Marseille', async () => {
      const results = await repository.search({
        departureCountry: 'France',
        departureCity: 'Lyon',
        arrivalCountry: 'France',
        arrivalCity: 'Marseille',
        departureDate: new Date('2025-06-01T12:00:00Z'),
        arrivalDate: new Date('2025-06-01T16:00:00Z'),
      })

      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(supersetRoute.id)
    })

    it('should return only exact match when searching Paris -> Marseille', async () => {
      const results = await repository.search({
        departureCountry: 'France',
        departureCity: 'Paris',
        arrivalCountry: 'France',
        arrivalCity: 'Marseille',
      })

      expect(results).toHaveLength(1)
      expect(results[0].id).toBe(supersetRoute.id)
    })

    it('should not return routes when searched segment is not contained', async () => {
      const results = await repository.search({
        departureCountry: 'France',
        departureCity: 'Lyon',
        arrivalCountry: 'France',
        arrivalCity: 'Paris', // Wrong direction
      })

      expect(results).toHaveLength(0)
    })

    it('should work with multiple intermediate stops', async () => {
      // Create a route: Paris -> Nice (with stops in Lyon, Marseille)
      const lyonStop: CreateIntermediateStop = {
        country: 'France',
        city: 'Lyon',
        date: new Date('2025-06-02T10:00:00Z'),
      }
      const marseilleStop: CreateIntermediateStop = {
        country: 'France',
        city: 'Marseille',
        date: new Date('2025-06-02T14:00:00Z'),
      }

      const multiStopRoute = new Route({
        departureCountry: 'France',
        departureCity: 'Paris',
        departureDate: new Date('2025-06-02T06:00:00Z'),
        arrivalCountry: 'France',
        arrivalCity: 'Nice',
        arrivalDate: new Date('2025-06-02T18:00:00Z'),
        intermediateStops: [lyonStop, marseilleStop],
        description: 'Long route with multiple stops',
        price: 120,
        transporterId: 'transporter-1',
      })

      const publishedMultiStopRoute = multiStopRoute.publish()
      await repository.save(publishedMultiStopRoute)

      // Search for Lyon -> Marseille segment
      const results = await repository.search({
        departureCountry: 'France',
        departureCity: 'Lyon',
        arrivalCountry: 'France',
        arrivalCity: 'Marseille',
      })

      // Should return both the superset from beforeEach and the new multi-stop route
      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results.map((r) => r.id)).toContain(publishedMultiStopRoute.id)
    })

    it('should respect date filters when searching supersets', async () => {
      // Search with different date (should not match)
      const results = await repository.search({
        departureCountry: 'France',
        departureCity: 'Paris',
        arrivalCountry: 'France',
        arrivalCity: 'Lyon',
        departureDate: new Date('2025-06-05T08:00:00Z'), // Different date
      })

      expect(results).toHaveLength(0)
    })

    it('should work when superset departure is at an intermediate stop', async () => {
      // Create a route: Berlin -> Paris -> Lyon -> Marseille
      const parisStop: CreateIntermediateStop = {
        country: 'France',
        city: 'Paris',
        date: new Date('2025-06-03T08:00:00Z'),
      }
      const lyonStop: CreateIntermediateStop = {
        country: 'France',
        city: 'Lyon',
        date: new Date('2025-06-03T12:00:00Z'),
      }

      const longRoute = new Route({
        departureCountry: 'Germany',
        departureCity: 'Berlin',
        departureDate: new Date('2025-06-03T00:00:00Z'),
        arrivalCountry: 'France',
        arrivalCity: 'Marseille',
        arrivalDate: new Date('2025-06-03T16:00:00Z'),
        intermediateStops: [parisStop, lyonStop],
        description: 'Very long route from Berlin',
        price: 150,
        transporterId: 'transporter-1',
      })

      const publishedLongRoute = longRoute.publish()
      await repository.save(publishedLongRoute)

      // Search for Paris -> Lyon segment (both are intermediate stops)
      const results = await repository.search({
        departureCountry: 'France',
        departureCity: 'Paris',
        arrivalCountry: 'France',
        arrivalCity: 'Lyon',
      })

      // Should include the long route where Paris and Lyon are intermediate stops
      expect(results.length).toBeGreaterThanOrEqual(1)
      expect(results.map((r) => r.id)).toContain(publishedLongRoute.id)
    })

    it('should filter by status for superset routes', async () => {
      // Create a cancelled superset route
      const lyonStop: CreateIntermediateStop = {
        country: 'France',
        city: 'Lyon',
        date: new Date('2025-06-04T12:00:00Z'),
      }

      const cancelledRoute = new Route({
        departureCountry: 'France',
        departureCity: 'Paris',
        departureDate: new Date('2025-06-04T08:00:00Z'),
        arrivalCountry: 'France',
        arrivalCity: 'Marseille',
        arrivalDate: new Date('2025-06-04T16:00:00Z'),
        intermediateStops: [lyonStop],
        description: 'Cancelled superset route',
        price: 80,
        transporterId: 'transporter-1',
      })

      const publishedThenCancelledRoute = cancelledRoute.publish().cancel()
      await repository.save(publishedThenCancelledRoute)

      // Search with PUBLISHED status filter
      const results = await repository.search({
        departureCountry: 'France',
        departureCity: 'Paris',
        arrivalCountry: 'France',
        arrivalCity: 'Lyon',
        status: RouteStatus.PUBLISHED,
      })

      // Should find existing published routes but not the cancelled one
      expect(results.every((r) => r.status === RouteStatus.PUBLISHED)).toBe(
        true,
      )
      expect(results.map((r) => r.id)).not.toContain(
        publishedThenCancelledRoute.id,
      )
    })
  })

  describe('search without superset detection (partial searches)', () => {
    it('should use original logic when only departure city is specified', async () => {
      const route1 = new Route({
        departureCountry: 'France',
        departureCity: 'Paris',
        departureDate: new Date('2025-06-01T08:00:00Z'),
        arrivalCountry: 'France',
        arrivalCity: 'Lyon',
        arrivalDate: new Date('2025-06-01T12:00:00Z'),
        description: 'Route 1',
        price: 50,
        transporterId: 'transporter-1',
      })

      const route2 = new Route({
        departureCountry: 'France',
        departureCity: 'Paris',
        departureDate: new Date('2025-06-01T08:00:00Z'),
        arrivalCountry: 'Spain',
        arrivalCity: 'Barcelona',
        arrivalDate: new Date('2025-06-01T20:00:00Z'),
        description: 'Route 2',
        price: 100,
        transporterId: 'transporter-1',
      })

      const publishedRoute1 = route1.publish()
      const publishedRoute2 = route2.publish()

      await repository.save(publishedRoute1)
      await repository.save(publishedRoute2)

      const results = await repository.search({
        departureCountry: 'France',
        departureCity: 'Paris',
      })

      expect(results).toHaveLength(2)
    })
  })
})
