import { gql } from '@apollo/client'

export const ROUTE_FRAGMENT = gql`
  fragment RouteFields on RouteDto {
    id
    departureCountry
    departureCity
    departureDate
    arrivalCountry
    arrivalCity
    arrivalDate
    intermediateStops {
      id
      country
      city
      date
    }
    description
    price
    transporterId
    status
    createdAt
    updatedAt
  }
`

export const CREATE_ROUTE = gql`
  ${ROUTE_FRAGMENT}
  mutation CreateRoute($input: CreateRouteInput!) {
    createRoute(input: $input) {
      ...RouteFields
    }
  }
`

export const SEARCH_ROUTES = gql`
  ${ROUTE_FRAGMENT}
  query SearchRoutes($input: SearchRouteInput!) {
    searchRoutes(input: $input) {
      ...RouteFields
    }
  }
`

export const GET_ROUTE = gql`
  ${ROUTE_FRAGMENT}
  query GetRoute($id: String!) {
    route(id: $id) {
      ...RouteFields
    }
  }
`

export const GET_ALL_ROUTES = gql`
  ${ROUTE_FRAGMENT}
  query GetAllRoutes {
    routes {
      ...RouteFields
    }
  }
`

export const GET_ROUTES_BY_TRANSPORTER = gql`
  ${ROUTE_FRAGMENT}
  query GetRoutesByTransporter($transporterId: String!) {
    routesByTransporter(transporterId: $transporterId) {
      ...RouteFields
    }
  }
`

export const PUBLISH_ROUTE = gql`
  ${ROUTE_FRAGMENT}
  mutation PublishRoute($id: String!) {
    publishRoute(id: $id) {
      ...RouteFields
    }
  }
`

export const CANCEL_ROUTE = gql`
  ${ROUTE_FRAGMENT}
  mutation CancelRoute($id: String!) {
    cancelRoute(id: $id) {
      ...RouteFields
    }
  }
`

export const COMPLETE_ROUTE = gql`
  ${ROUTE_FRAGMENT}
  mutation CompleteRoute($id: String!) {
    completeRoute(id: $id) {
      ...RouteFields
    }
  }
`
