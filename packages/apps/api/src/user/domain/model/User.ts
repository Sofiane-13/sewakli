import { randomUUID } from 'crypto'

export class CreateUser {
  familyName: string
  firstName: string
}
export class User {
  id: string
  familyName: string
  firstName: string
  status: UserStatus
  createAt: Date

  constructor(createUser: CreateUser) {
    this.id = randomUUID()
    this.familyName = createUser.familyName
    this.firstName = createUser.firstName
    this.status = UserStatus.CREATED
    this.createAt = new Date()
  }

  isCreated(): boolean {
    return this.status === UserStatus.CREATED
  }

  changeStatuts(newStatus: UserStatus): void {
    this.status = newStatus
  }
}

export enum UserStatus {
  CREATED = 'CREATED',
  BLOCKED = 'BLOCKED',
}
