import { Module } from '@nestjs/common'
import { UserController } from './adapters/driving/UserController'
import { UserService } from './domain/inboudPorts/UserService'
import { IUserRepository } from './domain/outboundPorts/IUserRepository'
import { UserInMemory } from './adapters/driven/UserInMemory'

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: IUserRepository,
      useClass: UserInMemory, // can add condition on ENV, inject mock impl for unit testing
    },
  ],
})
export class UserModule {}
