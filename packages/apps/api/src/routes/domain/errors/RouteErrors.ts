export class RouteErrors {
  // Validation errors
  static readonly ARRIVAL_BEFORE_DEPARTURE =
    'Arrival date must be after departure date'
  static readonly NEGATIVE_PRICE = 'Price cannot be negative'
  static readonly INVALID_INTERMEDIATE_STOPS_ORDER =
    'Intermediate stops must be chronologically ordered between departure and arrival dates'

  // Business rule errors
  static readonly CANNOT_PUBLISH_INVALID_STATUS =
    'Cannot publish route in current status'
  static readonly CANNOT_CANCEL_INVALID_STATUS =
    'Cannot cancel route in current status'
  static readonly ONLY_PUBLISHED_CAN_COMPLETE =
    'Only published routes can be completed'

  // Not found errors
  static routeNotFound(id: string): string {
    return `Route with id ${id} not found`
  }
}
