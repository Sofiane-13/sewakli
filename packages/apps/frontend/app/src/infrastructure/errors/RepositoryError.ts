/**
 * Infrastructure-specific errors
 */
export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message)
    this.name = 'RepositoryError'
  }
}

export class NetworkError extends RepositoryError {
  constructor(message: string, originalError?: Error) {
    super(message, originalError)
    this.name = 'NetworkError'
  }
}

export class GraphQLError extends RepositoryError {
  constructor(message: string, originalError?: Error) {
    super(message, originalError)
    this.name = 'GraphQLError'
  }
}
