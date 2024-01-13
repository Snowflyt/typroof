import type { TyproofProjectOptions } from './test';

/**
 * The typroof config.
 */
export interface Config extends TyproofProjectOptions {}

export const defineConfig = (config: Config) => config;
