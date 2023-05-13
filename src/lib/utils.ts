/**
 * Encodes the provided JSON-serializable value as a base-64 string.
 */
export function jsonToBase64(value: any) {
  return Buffer.from(JSON.stringify(value)).toString('base64');
}


/**
 * Parses and decodes the provided base-64-encoded JSON value.
 */
export function base64ToJson<T = Record<string, any>>(value?: string) {
  if (!value) return;

  if (typeof value !== 'string')
    throw new TypeError(`[base64ToJson] Expected type of first argument to be "string", got "${typeof value}".`);

  return JSON.parse(Buffer.from(value, 'base64').toString('ascii')) as T;
}
