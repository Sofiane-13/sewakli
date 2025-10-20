import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { RouteModule } from './routes/route.module'
import { AuthModule } from './auth/auth.module'
import { TypeGraphQLModule } from 'typegraphql-nestjs'
import { ApolloDriver } from '@nestjs/apollo'
import { AppExceptionFilter } from './common/filters/app-exception.filter'

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloDriver,
      emitSchemaFile: true,
      context: ({ req }) => ({ currentUser: req.user }),
    }),
    UserModule,
    RouteModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AppExceptionFilter,
    },
  ],
})
export class AppModule {}
