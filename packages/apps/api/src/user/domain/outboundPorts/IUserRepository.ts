import { User } from '../model/User'

/**
 * Interface for User Repository, outbound port
 */
export interface IUserRepository {
  create(user: User): User
  findAll(): User[]
}

export const IUserRepository = Symbol('IUserRepository')
