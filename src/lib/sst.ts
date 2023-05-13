export interface GetSecretOptions {
  /**
   * If `true`, `getSecret` will throw if the indicated secret does not exist.
   */
  strict?: boolean;
}


/**
 * Utility for reading a secret from AWS SSM via SST's Config helper. Optionally
 * allows for throwing an error if the secret doesn't exist.
 */
export async function getSecret<T = string>(secretName: string, options?: GetSecretOptions): Promise<T> {
  const { Config } = await import('sst/node/config');

  if (options?.strict && !Reflect.has(Config, secretName))
    throw new Error(`[getSecret] Secret "${secretName}" has not been set.`);

  return Reflect.get(Config, secretName);
}
