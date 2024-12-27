import { Inject, Injectable } from '@nestjs/common'
import { User } from '../model/User'
import { IUserRepository } from '../outboundPorts/IUserRepository'
import { IUserService } from './IUserService'

/**
 * The implementation of the inbound port IUserService.
 */
@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  create(description: string, priority: number): User {
    const user = new User(description, priority)
    if (this.findActiveUsers().length >= 3) {
      throw new Error('User count is more than 3')
    }
    this.userRepository.create(user)
    return user
  }

  findAll(): User[] {
    return this.userRepository.findAll()
  }

  findActiveUsers(): User[] {
    return this.userRepository.findAll().filter((user) => !user.isClosed)
  }
}
