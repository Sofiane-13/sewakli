import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { RouteModule } from './routes/route.module'
import { TypeGraphQLModule } from 'typegraphql-nestjs'
import { ApolloDriver } from '@nestjs/apollo'

@Module({
  imports: [
    TypeGraphQLModule.forRoot({
      driver: ApolloDriver,
      emitSchemaFile: true,
      context: ({ req }) => ({ currentUser: req.user }),
    }),
    UserModule,
    RouteModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
