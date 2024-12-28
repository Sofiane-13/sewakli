import { ObjectType, Field, ID, ArgsType } from 'type-graphql'

@ObjectType()
export class UserGraphQl {
  @Field(() => ID)
  id: string

  @Field()
  familyName: string

  @Field()
  firstName: string
}

@ArgsType()
export class CreateUserGraphQl {
  @Field()
  familyName: string

  @Field()
  firstName: string
}
