import { Injectable } from '@nestjs/common'
import { User } from '../../domain/model/User'
import { IUserRepository } from '../../domain/outboundPorts/IUserRepository'

/**
 * This is the implementation of output port, to store things in memory.
 */
@Injectable()
export class UserInMemory implements IUserRepository {
  private readonly users: User[] = [
    new User({ familyName: 'Nom', firstName: 'Prenom' }),
  ]

  create(user: User): User {
    this.users.push(user)
    return user
  }

  findAll(): User[] {
    return this.users
  }
}
