import httpError from 'http-errors'
import { describe, it, expect, vi } from 'vitest'

import { httpErrorHandlerMiddleware } from './error-handler'

vi.mock('lib/powertools', () => ({
  logger: {
    error: vi.fn()
  }
}))

describe('onError', () => {
  const createRequest = () => ({
    error: {},
    response: {
      statusCode: undefined,
      headers: {},
      body: {} as any
    },
    event: {
      requestContext: {}
    }
  } as any)

  const { onError } = httpErrorHandlerMiddleware()

  if (!onError) throw new Error('httpErrorHandlerMiddleware did not return an "onError" phase.')

  describe('when provided an error from http-errors', () => {
    describe('that has a "code" property', () => {
      const request = createRequest()
      const error: any = new httpError.BadRequest()
      error.code = 'BAD_REQUEST'
      request.error = error

      it('should set response.body.error to its value', () => {
        onError(request)

        expect(JSON.parse(request.response.body)).toMatchObject({
          error: error.code
        })
      })

      describe('that is an Internal Server Error', () => {
        const request = createRequest()
        const error: any = new httpError.InternalServerError()
        request.error = error

        it('should set response.body.error to InternalServerError', () => {
          onError(request)

          expect(JSON.parse(request.response.body)).toMatchObject({
            error: 'InternalServerError'
          })
        })
      })

      describe('that is not an Internal Server Error', () => {
        const request = createRequest()
        const error: any = new httpError.BadRequest()
        request.error = error

        it('should strip the superfluous "Error" from response.body.error', () => {
          onError(request)

          expect(JSON.parse(request.response.body)).toMatchObject({
            error: 'BadRequest'
          })
        })
      })
    })

    describe('that has a "name" property', () => {
      const request = createRequest()
      const error: any = new httpError.BadRequest()
      error.name = 'BAD_REQUEST'
      request.error = error

      it('should set response.body.error to its value', () => {
        onError(request)

        expect(JSON.parse(request.response.body)).toMatchObject({
          error: error.name
        })
      })
    })

    it('should set response.statusCode to error.statusCode', () => {
      const request = createRequest()
      const error = new httpError.Unauthorized()
      request.error = error

      onError(request)
      expect(request.response.statusCode).toEqual(error.statusCode)
    })

    it('should set response.headers to error.headers', () => {
      const request = createRequest()
      const error = new httpError.Unauthorized()
      error.headers = { 'x-custom-header': 'true' }
      request.error = error

      onError(request)
      expect(request.response.headers).toMatchObject(error.headers)
    })

    it('should set response.body.message to error.message', () => {
      const request = createRequest()
      const error = new httpError.Unauthorized('Barnacles!')
      request.error = error

      onError(request)
      expect(JSON.parse(request.response.body)).toMatchObject({
        message: 'Barnacles!'
      })
    })
  })

  describe('when provided any other value', () => {
    describe('when the value has a "message" property', () => {
      const request = createRequest()
      const error = { message: 'Custom error message.' }
      request.error = error

      it('should set response.body.message to its value', () => {
        onError(request)
        expect(JSON.parse(request.response.body)).toMatchObject({
          message: error.message
        })
      })
    })

    describe('when the value does not have a "message" property', () => {
      const request = createRequest()
      request.error = {}

      it('should set response.body.message to "An unknown error occurred.".', () => {
        onError(request)
        expect(JSON.parse(request.response.body)).toMatchObject({
          message: 'An unknown error occurred.'
        })
      })
    })

    it('should set response.statusCode to 500', () => {
      const request = createRequest()
      onError(request)
      expect(request.response.statusCode).toBe(500)
    })

    it('should set response.body.error to InternalServerError', () => {
      const request = createRequest()
      onError(request)
      expect(JSON.parse(request.response.body)).toMatchObject({
        error: 'InternalServerError'
      })
    })
  })
})