import { registerBuiltinAnalyzers } from './assertions/assert';
import { createTyproofProject } from './test';

import type { CheckResult, TyproofProjectOptions } from './test';

/**
 * Check all type test files in the current working directory.
 * @param options Options for checking the type test files.
 * @returns
 */
export const typroof = (options?: TyproofProjectOptions): CheckResult[] => {
  registerBuiltinAnalyzers();
  const project = createTyproofProject(options);
  return project.testFiles.map(project.checkTestFile);
};
