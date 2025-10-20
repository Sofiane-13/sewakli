import { Module } from '@nestjs/common'
import { AuthResolver } from './adapters/driving/AuthResolver'
import { AuthService } from './domain/AuthService'
import { EmailService } from './infrastructure/EmailService'

@Module({
  providers: [AuthResolver, AuthService, EmailService],
  exports: [AuthService],
})
export class AuthModule {}
