import type { Plugin } from './plugin';
import type { TyproofProjectOptions } from './test';

/**
 * The typroof config.
 */
export interface Config extends TyproofProjectOptions {
  readonly plugins?: readonly Plugin[];
}

/**
 * Define a typroof config.
 * @param config The typroof config.
 * @returns The typroof config.
 */
export const defineConfig = (config: Config) => config;
