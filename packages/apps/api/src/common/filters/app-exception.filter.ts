import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { GqlArgumentsHost } from '@nestjs/graphql'
import { AppException } from '../exceptions/app.exception'

/**
 * Global exception filter for handling all application exceptions
 * Converts exceptions to GraphQL-friendly error responses
 */
@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AppExceptionFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    // Convert to GraphQL context
    const gqlHost = GqlArgumentsHost.create(host)
    const context = gqlHost.getContext()

    // Log the error
    this.logException(exception, context)

    // Handle custom AppException
    if (exception instanceof AppException) {
      return this.handleAppException(exception)
    }

    // Handle NestJS HttpException
    if (exception instanceof HttpException) {
      return this.handleHttpException(exception)
    }

    // Handle unknown errors
    return this.handleUnknownException(exception)
  }

  private handleAppException(exception: AppException) {
    // AppException already has structured format
    throw exception
  }

  private handleHttpException(exception: HttpException) {
    const status = exception.getStatus()
    const response = exception.getResponse()

    // Extract message from response
    const message =
      typeof response === 'string'
        ? response
        : (response as any).message || 'An error occurred'

    // Throw as GraphQL error with custom extensions
    const error: any = new Error(message)
    error.extensions = {
      code: this.getHttpStatusCode(status),
      statusCode: status,
      timestamp: new Date().toISOString(),
    }
    throw error
  }

  private handleUnknownException(exception: unknown) {
    // Log full error details for debugging
    this.logger.error(
      'Unhandled exception:',
      exception instanceof Error ? exception.stack : exception,
    )

    // Return generic error to client
    const error: any = new Error('Internal server error')
    error.extensions = {
      code: 'INTERNAL_SERVER_ERROR',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
    }

    // In development, include more details
    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
      error.extensions.originalError = exception.message
      error.extensions.stack = exception.stack
    }

    throw error
  }

  private getHttpStatusCode(status: number): string {
    const statusMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE',
    }

    return statusMap[status] || 'UNKNOWN_ERROR'
  }

  private logException(exception: unknown, context: any) {
    const errorDetails = {
      timestamp: new Date().toISOString(),
      path: context?.req?.url || 'graphql',
      exception: exception instanceof Error ? exception.message : exception,
    }

    if (exception instanceof AppException) {
      this.logger.warn(`AppException: ${exception.code}`, errorDetails)
    } else if (exception instanceof HttpException) {
      this.logger.warn(`HttpException: ${exception.getStatus()}`, errorDetails)
    } else {
      this.logger.error('Unhandled Exception', {
        ...errorDetails,
        stack: exception instanceof Error ? exception.stack : undefined,
      })
    }
  }
}
