import { IsNotEmpty } from 'class-validator'

/**
 * UserCommand
 * Used for CUD user
 */
export class UserCommand {
  @IsNotEmpty()
  description: string
  priority: number
}
