import { describe, it, expect } from 'vitest'

import {
  jsonToBase64,
  base64ToJson
} from './utils'

describe('jsonToBase64', () => {
  describe('when provided a non-serializable value', () => {
    it('should throw', () => {
      expect(() => {
        jsonToBase64({ globalThis })
      }).toThrow('circular structure')
    })
  })
})

describe('base64ToJson', () => {
  describe('when provided a non-string value', () => {
    it('should throw', () => {
      expect(() => {
        // @ts-expect-error
        // eslint-disable-next-line unicorn/no-null
        base64ToJson(null)
      }).toThrow('Expected first argument to be of type "string"')
    })
  })

  describe('when provided a string that is not valid base-64', () => {
    it('should throw', () => {
      expect(() => {
        base64ToJson('@$#%@#$%')
      }).toThrow('not valid base-64')
    })
  })

  describe('when provided a base-64 string that is not valid JSON', () => {
    it('should throw', () => {
      expect(() => {
        base64ToJson('dGhpcyBpcyBub3QgdmFsaWQgSlNPTg==')
      }).toThrow('Error serializing value')
    })
  })
})

describe('jsonToBase64 / base64ToJson', () => {
  it('should convert between JSON and base64', () => {
    const data = { foo: true }
    const dataAsBase64 = 'eyJmb28iOnRydWV9'
    expect(jsonToBase64(data)).toBe(dataAsBase64)
    expect(base64ToJson(dataAsBase64)).toEqual(data)
  })
})