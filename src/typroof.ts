import path from 'node:path';

import { registerBuiltinAnalyzers } from './assertions/assert';
import type { Config } from './config';
import { loadConfig } from './config-helpers';
import type { CheckResult } from './runtime';
import { createTyproofProject } from './runtime';

class TypeCheckError extends Error {
  public readonly messages: readonly string[];

  constructor(messages: readonly string[]) {
    super('Type check failed:\n' + messages.map((m) => `  * ${m}`).join('\n'));
    this.name = 'TypeCheckError';
    this.messages = messages;
  }
}

/**
 * Check all type test files in the current working directory.
 * @param options Options for checking the type test files.
 * @returns
 *
 * @throws {TypeCheckError} If the type check fails.
 */
export async function typroof(options?: Config & { cwd?: string }): Promise<CheckResult[]> {
  const cwd = options?.cwd ?? process.cwd();

  registerBuiltinAnalyzers();
  const project = createTyproofProject({
    tsConfigFilePath: path.join(cwd, 'tsconfig.json'),
    ...(await loadConfig({ cwd })),
    ...options,
  });

  const messages: string[] = [];
  project.checkFiles.forEach((file) =>
    Array.prototype.push.apply(messages, project.performTypeCheck(file) as string[]),
  );
  if (messages.length > 0) throw new TypeCheckError(messages);

  return project.testFiles.map(project.checkTestFile);
}
