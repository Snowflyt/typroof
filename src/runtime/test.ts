import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type * as ts from 'typescript';

import { getExportedSymbols } from './ts-utils';

/**
 * Group test cases.
 */
export function describe(name: string, fn: () => void | Promise<void>) {}

/**
 * Create a test case.
 */
export function test(name: string, fn: () => void | Promise<void>) {}

/**
 * Alias for `test`.
 *
 * @see {@link test}
 */
export function it(name: string, fn: () => void | Promise<void>) {
  test(name, fn);
}

const currentFilePathName = (() => {
  let result = '';
  try {
    result = __filename;
  } catch (error) {
    result = fileURLToPath(import.meta.url);
  }
  if (path.extname(result) === '.js')
    result = path.join(path.dirname(result), path.basename(result, '.js') + '.d.ts');
  return result;
})();

export const getTestSymbols = ({
  program,
  typeChecker,
}: {
  program: ts.Program;
  typeChecker: ts.TypeChecker;
}) =>
  getExportedSymbols({
    program,
    typeChecker,
    modulePath: currentFilePathName,
    symbolNames: ['describe', 'it', 'test'],
  });
