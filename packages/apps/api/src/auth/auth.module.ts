import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthResolver } from './adapters/driving/AuthResolver'
import { AuthService } from './domain/AuthService'
import { JwtTokenService } from './domain/JwtTokenService'
import { EmailService } from './infrastructure/EmailService'
import { JwtStrategy } from './infrastructure/jwt.strategy'
import { JwtAuthGuard } from './infrastructure/jwt-auth.guard'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  providers: [
    AuthResolver,
    AuthService,
    JwtTokenService,
    EmailService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [AuthService, JwtTokenService, JwtAuthGuard],
})
export class AuthModule {}
