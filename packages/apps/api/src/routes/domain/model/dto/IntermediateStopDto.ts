import { Field, InputType, ObjectType } from 'type-graphql'

@InputType()
export class CreateIntermediateStopInput {
  @Field(() => String)
  country!: string

  @Field(() => String)
  city!: string

  @Field(() => Date)
  date!: Date
}

@ObjectType()
export class IntermediateStopDto {
  @Field(() => String)
  id!: string

  @Field(() => String)
  country!: string

  @Field(() => String)
  city!: string

  @Field(() => Date)
  date!: Date
}
