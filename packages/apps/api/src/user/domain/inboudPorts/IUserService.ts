import { User } from '../model/User'

/**
 * Our domain input port
 */

export interface IUserService {
  create(description: string, priority: number): User
  findAll(): User[]
  findActiveUsers(): User[]
}
