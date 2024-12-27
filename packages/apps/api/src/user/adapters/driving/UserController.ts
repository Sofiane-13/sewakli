import { Body, Controller, Get, Logger, Post } from '@nestjs/common'
import { UserService } from '../../domain/inboudPorts/UserService'

import { UserCommand } from '../model/UserCommand'

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name)

  constructor(private userService: UserService) {}

  @Get()
  findAll(): any[] {
    return this.userService.findAll()
  }

  @Post()
  create(@Body() userCommand: UserCommand): any {
    const user = this.userService.create(
      userCommand.description,
      userCommand.priority,
    )
    this.logger.debug(userCommand)
    this.logger.debug({ ticker: user })
    return { ...user }
  }
}
