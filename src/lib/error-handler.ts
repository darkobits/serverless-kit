import { isHttpError } from 'http-errors';

import { logger } from 'lib/powertools';
import { res } from 'lib/response';

import type { MiddyMiddleware } from 'etc/types';


/**
 * Middy middleware for handling errors thrown in lambdas.
 */
export function httpErrorHandlerMiddleware(): MiddyMiddleware {
  return {
    onError: req => {
      const { error, event, response } = req;
      let message = error?.message ?? 'An unknown error occurred.';

      message = message.replace(/\.{2}$/g, '.');

      if (isHttpError(error)) {
        // Error was created using http-errors.
        req.response = {
          ...response,
          ...res({
            statusCode: error.statusCode,
            headers: error.headers,
            body: {
              error: error.code ?? error.name,
              message
            }
          })
        };
      } else {
        // Error is a generic error.
        req.response = {
          ...response,
          ...res({
            statusCode: 500,
            body: {
              error: 'InternalServerError',
              message
            }
          })
        };
      }

      logger.error({
        message,
        http: event.requestContext.http
      });
    }
  };
}
