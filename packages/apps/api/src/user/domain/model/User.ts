import { randomUUID } from 'crypto'

export class User {
  private id: string
  description: string
  status: UserStatus
  createAt: Date
  updateAt: Date
  priority: number
  constructor(description: string, priority: number) {
    this.id = randomUUID()
    this.description = description
    this.status = UserStatus.OPEN
    this.createAt = new Date()
    this.updateAt = new Date()
    this.priority = priority
  }

  isClosed(): boolean {
    return this.status === UserStatus.CLOSED
  }
}

enum UserStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}
