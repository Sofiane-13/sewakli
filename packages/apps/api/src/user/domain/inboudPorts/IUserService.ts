import {
  CreateUserGraphQl,
  UserGraphQl,
} from 'src/user/adapters/driving/user.model'

/**
 * Our domain input port
 */

export interface IUserService {
  create(createUserInput: CreateUserGraphQl): UserGraphQl
  findAll(): UserGraphQl[]
  findCreatedUsers(): UserGraphQl[]
}
