import type { MiddlewareObj } from '@middy/core'
import type {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult
} from 'aws-lambda'

/**
 * Event type that will be provided to our handlers.
 */
export type Event = APIGatewayProxyEventV2;

/**
 * Type that our handlers are expected to return.
 */
export type Response = APIGatewayProxyResult;

/**
 * Middy middleware signature for our event/response types.
 */
export type MiddyMiddleware = MiddlewareObj<Event, Response>;