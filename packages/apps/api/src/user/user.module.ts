import { Module } from '@nestjs/common'
import { UserResolver } from './adapters/driving/UserResolver'
import { UserService } from './domain/inboudPorts/UserService'
import { IUserRepository } from './domain/outboundPorts/IUserRepository'
import { UserInMemory } from './adapters/driven/UserInMemory'

@Module({
  imports: [],
  controllers: [],
  providers: [
    UserResolver,
    UserService,
    {
      provide: IUserRepository,
      useClass: UserInMemory, // can add condition on ENV, inject mock impl for unit testing
    },
  ],
})
export class UserModule {}
