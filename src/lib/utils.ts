import os from 'os';

import nodeMachineId from 'node-machine-id';


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
  if (typeof value !== 'string')
    throw new TypeError(`[base64ToJson] Expected first argument to be of type "string", got "${typeof value}".`);

  if (!value) return;

  let decodedValue: string;

  try {
    decodedValue = Buffer.from(value, 'base64').toString('ascii');
    if (decodedValue.length === 0) throw new Error('Got an empty string.');
  } catch (err: any) {
    throw new Error('[base64ToJson] The provided value is not valid base-64.', { cause: err });
  }

  try {
    return JSON.parse(decodedValue) as T;
  } catch (err: any) {
    throw new Error(`[base64ToJson] Error serializing value: ${err.message}`, { cause: err });
  }
}


/**
 * Computes the stage name for local development using a combination of the
 * local username and a unique machine identifier.
 */
export function getLocalStageName() {
  const localUsername = os.userInfo().username;
  const localMachineId = nodeMachineId.machineIdSync().slice(0, 7);
  return `local-${localUsername}-${localMachineId}`;
}
