import { describe, it, expect, vi } from 'vitest';

import { getSecret } from './sst';

vi.mock('sst/node/config', () => ({
  Config: {
    foo: 'bar'
  }
}));


describe('getSecret', () => {
  describe('when strict mode is not set', () => {
    it('should return the value of the secret or undefined', async () => {
      expect(await getSecret('foo')).toBe('bar');
      expect(await getSecret('baz')).toBe(undefined);
    });
  });

  describe('when strict mode is set', () => {
    it('should return the value of the secret or undefined', async () => {
      expect.assertions(2);

      expect(await getSecret('foo', { strict: true })).toBe('bar');

      try {
        await getSecret('baz', { strict: true });
      } catch (err: any) {
        expect(err.message).toMatch('has not been set');
      }
    });
  });
});
