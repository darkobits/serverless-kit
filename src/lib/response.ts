import httpError from 'http-errors'

import type { APIGatewayProxyResult } from 'aws-lambda'

/**
 * Options accepted by `res`.
 */
export interface ResponseOptions {
  statusCode?: APIGatewayProxyResult['statusCode']
  headers?: APIGatewayProxyResult['headers']
  multiValueHeaders?: APIGatewayProxyResult['multiValueHeaders']
  body?: any
  isBase64Encoded?: APIGatewayProxyResult['isBase64Encoded']
}

/**
 * Creates well-formed responses for lambda's that return APIGatewayProxyResult
 * response types. Specifically, serializes any non-string values for `body` and
 * set appropriate headers.
 *
 * See: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 */
export function res<R extends APIGatewayProxyResult = APIGatewayProxyResult>(options: ResponseOptions): R {
  try {
    const response = {} as R

    // N.B. This property _must_ be included in our response for AWS to consider
    // it a structured response. Without this field, AWS will consider all other
    // properties to be part of the response body.
    response.statusCode = options.statusCode ?? 200
    response.headers = response.headers ?? {}

    if (options.body !== undefined) {
      if (typeof options.body === 'string') {
        response.headers['content-type'] = 'text/plain'
        response.body = options.body
      } else {
        response.headers['content-type'] = 'application/json'
        response.body = JSON.stringify(options.body)
      }

      response.headers['content-length'] = response.body.length
    }

    if (options.headers) {
      for (const header in options.headers) {
        response.headers[header] = options.headers[header]
      }
    }

    if (options.multiValueHeaders) {
      response.multiValueHeaders = options.multiValueHeaders
    }

    if (options.isBase64Encoded) {
      response.isBase64Encoded = options.isBase64Encoded
    }

    return response
  } catch (err: any) {
    const finalError = new httpError.InternalServerError(`Error serializing response body: ${err.message}`)
    finalError.cause = err
    throw finalError
  }
}

/**
 * Shorthand for sending 200 responses with JSON bodies.
 */
res.json = (body: any) => res({ body })

/**
 * Sends a 302 redirect to the provided URL.
 */
res.redirectTo = (location: string) => res({ statusCode: 302, headers: { location }})

/**
 * Sends a 200 response with base64-encoded image data.
 *
 * The first argument should be a partial (ie: "jpeg") or full (ie:
 * "image/jpeg") MIME type. The second parameter should be a pre-encoded base-64
 * string or a Buffer containing binary data.
 */
res.base64Image = (mimeType: string, data: string | Parameters<typeof Buffer.from>[0]) => {
  try {
    const body = typeof data === 'string'
      ? data
      : Buffer.from(data, 'binary').toString('base64')

    return res({
      headers: {
        'content-type': mimeType.includes('/') ? mimeType : `image/${mimeType}`
      },
      body,
      isBase64Encoded: true
    })
  } catch (err: any) {
    throw new httpError.InternalServerError(err.message)
  }
}