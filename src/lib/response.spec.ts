import { describe, it, expect } from 'vitest';

import { res } from './response';


describe('res', () => {
  describe('when provided an explicit status code', () => {
    it('should return a response with the provided status code', () => {
      expect(res({ statusCode: 500 })).toMatchObject({ statusCode: 500 });
    });
  });

  describe('when a status code is omitted', () => {
    it('should use status code 200', () => {
      expect(res({ body: '' })).toMatchObject({ statusCode: 200 });
    });
  });

  describe('when provided a string body', () => {
    it('should set the content-type header to "text/plain"', () => {
      expect(res({
        body: ''
      })).toMatchObject({
        headers: {
          'content-type': 'text/plain'
        }
      });
    });
  });

  describe('when provided a non-string body', () => {
    it('should set the content-type header to "application/json"', () => {
      expect(res({
        body: { kittens: true }
      })).toMatchObject({
        headers: {
          'content-type': 'application/json'
        }
      });
    });
  });

  describe('when provided headers', () => {
    it('should set headers', () => {
      const headers = {
        'accept': '*/*'
      };

      expect(res({ headers })).toMatchObject({ headers });
    });
  });

  describe('when provided multi-value headers', () => {
    it('should set headers', () => {
      const multiValueHeaders = {
        'foo': ['bar', 'baz', 'qux']
      };

      expect(res({ multiValueHeaders })).toMatchObject({ multiValueHeaders });
    });
  });

  describe('when isBase64Encoded is set', () => {
    it('isBase64Encoded should be present in the response', () => {
      expect(res({ isBase64Encoded: true })).toMatchObject({ isBase64Encoded: true });
    });
  });
});

describe('res.json', () => {
  it('should set appropriate status code and headers', () => {
    const json = { name: 'Frodo' };

    expect(res.json({ name: 'Frodo' })).toMatchObject({
      headers: {
        'content-type': 'application/json',
        'content-length':  JSON.stringify(json).length
      },
      body: JSON.stringify(json)
    });
  });
});

describe('res.redirectTo', () => {
  it('should set appropriate status code and headers', () => {
    const url = 'https://crayola.com';

    expect(res.redirectTo(url)).toMatchObject({
      statusCode: 302,
      headers: {
        'location': url
      }
    });
  });
});

describe('res.base64Image', () => {
  it('should set appropriate status code and headers', () => {
    // const url = 'https://crayola.com';

    expect(res.base64Image('png', 'imageData')).toMatchObject({
      statusCode: 200,
      headers: {
        'content-type': 'image/png'
      },
      body: 'imageData',
      isBase64Encoded: true
    });
  });
});
