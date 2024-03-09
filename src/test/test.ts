import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Project } from 'ts-morph';

/**
 * Group test cases.
 */
export const describe: (name: string, fn: () => void | Promise<void>) => void = () => {};

/**
 * Create a test case.
 */
export const test: (name: string, fn: () => void | Promise<void>) => void = () => {};

/**
 * Alias for `test`.
 *
 * @see {@link test}
 */
export const it = (name: string, fn: () => void | Promise<void>) => test(name, fn);

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
export const getTestSymbols = (project: Project) => {
  const file = project.addSourceFileAtPath(currentFilePathName);
  const describeSymbol = file.getExportedDeclarations().get('describe')?.[0]?.getSymbol();
  if (!describeSymbol) throw new Error('Can not find `describe` symbol');
  const testSymbol = file.getExportedDeclarations().get('test')?.[0]?.getSymbol();
  if (!testSymbol) throw new Error('Can not find `test` symbol');
  const itSymbol = file.getExportedDeclarations().get('it')?.[0]?.getSymbol();
  if (!itSymbol) throw new Error('Can not find `it` symbol');
  return { describeSymbol, testSymbol, itSymbol };
};
