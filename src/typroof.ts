import path from 'node:path';

import { registerBuiltinAnalyzers } from './assertions/assert';
import type { Config } from './config';
import { loadConfig } from './config-helpers';
import type { CheckResult } from './runtime';
import { createTyproofProject } from './runtime';

/**
 * Check all type test files in the current working directory.
 * @param options Options for checking the type test files.
 * @returns
 */
export async function typroof(options?: Config & { cwd?: string }): Promise<CheckResult[]> {
  const cwd = options?.cwd ?? process.cwd();

  registerBuiltinAnalyzers();
  const project = createTyproofProject({
    tsConfigFilePath: path.join(cwd, 'tsconfig.json'),
    ...(await loadConfig({ cwd })),
    ...options,
  });
  return project.testFiles.map(project.checkTestFile);
}
