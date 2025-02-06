import path from 'node:path';

import { registerBuiltinAnalyzers } from './assertions/assert';
import { loadConfig } from './config-helpers';
import { createTyproofProject } from './test';

import type { Config } from './config';
import type { CheckResult } from './runtime';

/**
 * Check all type test files in the current working directory.
 * @param options Options for checking the type test files.
 * @returns
 */
export const typroof = async (options?: Config & { cwd?: string }): Promise<CheckResult[]> => {
  const cwd = options?.cwd ?? process.cwd();

  registerBuiltinAnalyzers();
  const project = createTyproofProject({
    tsConfigFilePath: path.join(cwd, 'tsconfig.json'),
    ...(await loadConfig({ cwd })),
    ...options,
  });
  return project.testFiles.map(project.checkTestFile);
};
