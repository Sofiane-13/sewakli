import { Inject, Injectable } from '@nestjs/common'
import { User } from '../model/User'
import { IUserRepository } from '../outboundPorts/IUserRepository'
import { IUserService } from './IUserService'
import {
  CreateUserGraphQl,
  UserGraphQl,
} from 'src/user/adapters/driving/user.model'

/**
 * The implementation of the inbound port IUserService.
 */
@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  create(createUserInput: CreateUserGraphQl): UserGraphQl {
    const user = new User(createUserInput)
    if (this.findCreatedUsers().length >= 3) {
      throw new Error('User count is more than 3')
    }
    this.userRepository.create(user)
    return UserService.toGraphQLUser(user)
  }

  findAll(): UserGraphQl[] {
    return this.userRepository
      .findAll()
      .map((user) => UserService.toGraphQLUser(user))
  }

  findCreatedUsers(): UserGraphQl[] {
    return this.userRepository
      .findAll()
      .filter((user) => user.isCreated())
      .map((user) => UserService.toGraphQLUser(user))
  }

  static toGraphQLUser = (user: User): UserGraphQl => {
    return {
      id: user.id,
      familyName: user.familyName,
      firstName: user.firstName,
    }
  }
}
