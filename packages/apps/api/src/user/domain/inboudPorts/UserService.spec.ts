import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './UserService'
import { IUserRepository } from '../outboundPorts/IUserRepository'
import { User, UserStatus } from '../model/User'
import { CreateUserGraphQl } from 'src/user/adapters/driving/User.model'

describe('UserService', () => {
  let userService: UserService
  let userRepository: jest.Mocked<IUserRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: IUserRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile()

    userService = module.get<UserService>(UserService)
    userRepository = module.get<IUserRepository>(
      IUserRepository,
    ) as jest.Mocked<IUserRepository>
  })

  describe('create', () => {
    it('should create and return a UserGraphQl object', () => {
      userRepository.findAll.mockReturnValue([]) // no users initially
      const createUserInput: CreateUserGraphQl = {
        firstName: 'John',
        familyName: 'Doe',
      }

      const result = userService.create(createUserInput)

      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: 'John',
          familyName: 'Doe',
          status: 'CREATED',
        }),
      )
      expect(result).toHaveProperty('id')
      expect(result.firstName).toBe('John')
      expect(result.familyName).toBe('Doe')
    })

    it('should throw an error when user count is more than 3', () => {
      userRepository.findAll.mockReturnValue([
        new User({ firstName: 'A', familyName: 'A' }),
        new User({ firstName: 'B', familyName: 'B' }),
        new User({ firstName: 'C', familyName: 'C' }),
      ]) // three users initially

      const createUserInput: CreateUserGraphQl = {
        firstName: 'Jane',
        familyName: 'Smith',
      }

      expect(() => userService.create(createUserInput)).toThrow(
        'User count is more than 3',
      )
    })
  })

  describe('findAll', () => {
    it('should return all users', () => {
      const mockUsers = [new User({ firstName: 'John', familyName: 'Doe' })]
      userRepository.findAll.mockReturnValue(mockUsers)

      const result = userService.findAll()

      expect(result).toHaveLength(1)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('firstName', 'John')
    })
  })

  describe('findCreatedUsers', () => {
    it('should return only created users', () => {
      const user = new User({ firstName: 'John', familyName: 'Smith' })
      user.changeStatuts(UserStatus.BLOCKED)
      const mockUsers = [
        new User({ firstName: 'Jane', familyName: 'Doe' }),
        user,
      ]
      userRepository.findAll.mockReturnValue(mockUsers)

      const result = userService.findCreatedUsers()

      expect(result).toHaveLength(1)
      expect(result[0].firstName).toBe('Jane')
    })
  })
})
