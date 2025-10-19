import { Logger } from '@nestjs/common'
import { Resolver, Query, Mutation, Args } from 'type-graphql'
import { CreateUserGraphQl, UserGraphQl } from './User.model'
import { UserService } from '../../domain/inboudPorts/UserService'

@Resolver(() => UserGraphQl)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name)
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserGraphQl])
  async users(): Promise<UserGraphQl[]> {
    return this.userService.findAll()
  }

  @Mutation(() => UserGraphQl)
  async addUser(
    @Args() createUserInput: CreateUserGraphQl,
  ): Promise<UserGraphQl> {
    this.logger.debug("Creation de l'utilisateur")
    return this.userService.create(createUserInput)
  }
}
