import path from 'node:path';

import { Project } from 'ts-morph';

import { getExpectSymbol } from '../assertions/assert';

import { analyzeTestFile } from './analyze';
import { checkAnalyzeResult } from './check';
import { getTestSymbols } from './test';

import type { CheckResult } from './check';
import type { Diagnostic, ProjectOptions, SourceFile, Symbol, ts } from 'ts-morph';

/**
 * An extension of the ts-morph `Project`.
 */
export interface TyproofProject extends Project {
  readonly cachedPreEmitDiagnostics: readonly Diagnostic<ts.Diagnostic>[];
  readonly testFiles: readonly SourceFile[];

  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly getExpectSymbol: () => Symbol;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly getDescribeSymbol: () => Symbol;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly getItSymbol: () => Symbol;
  // eslint-disable-next-line @typescript-eslint/ban-types
  readonly getTestSymbol: () => Symbol;

  readonly checkTestFile: (file: SourceFile) => CheckResult;
}

/**
 * Options for creating a typroof project, which is an extension of the ts-morph `Project`.
 */
export interface TyproofProjectOptions {
  /**
   * The path to the `tsconfig.json` file.
   * @default path.join(process.cwd(), 'tsconfig.json')
   */
  tsConfigFilePath?: string;
  /* eslint-disable no-irregular-whitespace */
  /**
   * File glob or globs to add to the project.
   * @default ['**​/*.proof.{ts,tsx}', 'proof/**​/*.{ts,tsx}']
   */
  /* eslint-enable no-irregular-whitespace */
  testFiles?: string | readonly string[];
  /**
   * Options to pass to the ts-morph project.
   */
  projectOptions?: Omit<ProjectOptions, 'tsConfigFilePath' | 'skipAddingFilesFromTsConfig'>;
}

/**
 * Create a typroof project, which is an extension of the ts-morph `Project`.
 * @param options Options for creating a typroof project.
 * @returns A typroof project.
 *
 * @example
 * ```typescript
 * import { createTyproofProject, formatGroupResult, formatSummary } from 'typroof';
 *
 * const project = createTyproofProject();
 *
 * const startedAt = new Date();
 * const checkResults = project.testFiles.map(project.checkTestFile);
 * const finishedAt = new Date();
 *
 * for (const checkResult of checkResults) {
 *   console.log(formatGroupResult(checkResult.rootGroupResult));
 *   console.log();
 * }
 * console.log(
 *   formatSummary({ groups: results.map((r) => r.rootGroupResult), startedAt, finishedAt }),
 * );
 * ```
 */
export const createTyproofProject = (options?: TyproofProjectOptions): TyproofProject => {
  const {
    projectOptions,
    testFiles: testFileGlobs,
    tsConfigFilePath,
  } = {
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    testFiles: ['**/*.proof.{ts,tsx}', 'proof/**/*.{ts,tsx}'],
    projectOptions: {},
    ...options,
  };

  const project = new Project({
    tsConfigFilePath,
    skipAddingFilesFromTsConfig: true,
    ...projectOptions,
  });
  const testFiles = project.addSourceFilesAtPaths(testFileGlobs);

  const expectSymbol = getExpectSymbol(project);
  const { describeSymbol, itSymbol, testSymbol } = getTestSymbols(project);

  const result = Object.assign(project, {
    cachedPreEmitDiagnostics: project.getPreEmitDiagnostics(),
    testFiles,

    getExpectSymbol: () => expectSymbol,
    getDescribeSymbol: () => describeSymbol,
    getItSymbol: () => itSymbol,
    getTestSymbol: () => testSymbol,

    checkTestFile: (file: SourceFile): CheckResult =>
      checkAnalyzeResult(analyzeTestFile(result as TyproofProject, file)),
  }) satisfies TyproofProject;
  return result;
};
