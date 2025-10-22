import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from 'type-graphql'
import { RouteStatus } from '../Route'
import {
  CreateIntermediateStopInput,
  IntermediateStopDto,
} from './IntermediateStopDto'

// Register enum for GraphQL
registerEnumType(RouteStatus, {
  name: 'RouteStatus',
  description: 'The status of a route',
})

@InputType()
export class CreateRouteInput {
  @Field(() => String)
  departureCountry!: string

  @Field(() => String)
  departureCity!: string

  @Field(() => Date)
  departureDate!: Date

  @Field(() => String)
  arrivalCountry!: string

  @Field(() => String)
  arrivalCity!: string

  @Field(() => Date)
  arrivalDate!: Date

  @Field(() => [CreateIntermediateStopInput], { nullable: true })
  intermediateStops?: CreateIntermediateStopInput[]

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Float, { nullable: true })
  price?: number

  @Field(() => String, { nullable: true })
  transporterId?: string
}

@InputType()
export class SearchRouteInput {
  @Field(() => String, { nullable: true })
  departureCountry?: string

  @Field(() => String, { nullable: true })
  departureCity?: string

  @Field(() => Date, { nullable: true })
  departureDate?: Date

  @Field(() => String, { nullable: true })
  arrivalCountry?: string

  @Field(() => String, { nullable: true })
  arrivalCity?: string

  @Field(() => Date, { nullable: true })
  arrivalDate?: Date

  @Field(() => RouteStatus, { nullable: true })
  status?: RouteStatus
}

@ObjectType()
export class RouteDto {
  @Field(() => String)
  id!: string

  @Field(() => String)
  departureCountry!: string

  @Field(() => String)
  departureCity!: string

  @Field(() => Date)
  departureDate!: Date

  @Field(() => String)
  arrivalCountry!: string

  @Field(() => String)
  arrivalCity!: string

  @Field(() => Date)
  arrivalDate!: Date

  @Field(() => [IntermediateStopDto])
  intermediateStops!: IntermediateStopDto[]

  @Field(() => String, { nullable: true })
  description?: string

  @Field(() => Float, { nullable: true })
  price?: number

  @Field(() => String)
  transporterId!: string

  @Field(() => RouteStatus)
  status!: RouteStatus

  @Field(() => Date)
  createdAt!: Date

  @Field(() => Date)
  updatedAt!: Date
}
