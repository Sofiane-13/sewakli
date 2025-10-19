import { Module } from '@nestjs/common'
import { RouteResolver } from './adapters/driving/RouteResolver'
import { RouteService } from './domain/inboundPorts/RouteService'
import { IRouteServiceToken } from './domain/inboundPorts/IRouteService'
import { RouteInMemory } from './adapters/driven/RouteInMemory'
import { IRouteRepositoryToken } from './domain/outboundPorts/IRouteRepository'

@Module({
  providers: [
    // Resolver (driving adapter)
    RouteResolver,

    // Service (inbound port)
    {
      provide: IRouteServiceToken,
      useClass: RouteService,
    },

    // Repository (outbound port with in-memory implementation)
    {
      provide: IRouteRepositoryToken,
      useClass: RouteInMemory,
    },
  ],
  exports: [IRouteServiceToken, IRouteRepositoryToken],
})
export class RouteModule {}
