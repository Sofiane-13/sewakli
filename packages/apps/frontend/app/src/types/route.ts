// Kept for future use in route creation
export interface IntermediateStop {
  id: string
  country: string
  city: string
  date: string
}

export interface RouteSearchData {
  departureCountry: string
  departureCity: string
  departureDate: string
  arrivalCountry: string
  arrivalCity: string
  arrivalDate: string
}

// For route creation (future use)
export interface RouteCreationData extends RouteSearchData {
  intermediateStops: IntermediateStop[]
}
