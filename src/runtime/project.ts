import path from 'node:path';

import { globSync } from 'tinyglobby';
import * as ts from 'typescript';

import { getExpectSymbol } from '../assertions/assert';

import { analyzeTestFile } from './analyze';
import type { CheckResult } from './check';
import { checkAnalyzeResult } from './check';
import { getTestSymbols } from './test';

/**
 * A Typroof project.
 */
export interface TyproofProject {
  // Core TypeScript components
  readonly program: ts.Program;
  readonly typeChecker: ts.TypeChecker;
  readonly testFiles: readonly ts.SourceFile[];
  readonly diagnostics: readonly ts.Diagnostic[];

  // Symbol getters
  readonly getExpectSymbol: () => ts.Symbol;
  readonly getDescribeSymbol: () => ts.Symbol;
  readonly getItSymbol: () => ts.Symbol;
  readonly getTestSymbol: () => ts.Symbol;

  // Testing functionality
  readonly checkTestFile: (file: ts.SourceFile) => CheckResult;
}

/**
 * Options for creating a Typroof project.
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
   * Additional compiler options to override those in tsconfig.json.
   */
  compilerOptions?: ts.CompilerOptions;
}

/**
 * Create a Typroof project for running type tests.
 * @param options Options for creating a Typroof project.
 * @returns A Typroof project.
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
export function createTyproofProject(options?: TyproofProjectOptions): TyproofProject {
  const {
    compilerOptions = {},
    testFiles: testFileGlobs = ['**/*.proof.{ts,tsx}', 'proof/**/*.{ts,tsx}'],
    tsConfigFilePath = path.join(process.cwd(), 'tsconfig.json'),
  } = options || {};

  // Parse tsconfig.json
  const configFile = ts.readConfigFile(tsConfigFilePath, (path) => ts.sys.readFile(path));
  if (configFile.error)
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    throw new Error(`Error reading tsconfig.json: ${String(configFile.error.messageText)}`);

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsConfigFilePath),
    compilerOptions,
  );

  // Find test files
  const testFilePatterns = Array.isArray(testFileGlobs) ? testFileGlobs : [testFileGlobs];
  const testFilePaths = testFilePatterns.flatMap((pattern) =>
    globSync(pattern, { ignore: 'node_modules/**' }),
  );

  // Create program
  const program = ts.createProgram(testFilePaths, parsedConfig.options);

  const typeChecker = program.getTypeChecker();
  const diagnostics = ts.getPreEmitDiagnostics(program);
  const testFiles = program
    .getSourceFiles()
    .filter((file) => testFilePaths.includes(file.fileName));

  // Get symbols
  const expectSymbol = getExpectSymbol({ program, typeChecker });
  const {
    describe: describeSymbol,
    it: itSymbol,
    test: testSymbol,
  } = getTestSymbols({ program, typeChecker });

  const project: TyproofProject = {
    program,
    typeChecker,
    testFiles,
    diagnostics,

    getExpectSymbol: () => expectSymbol,
    getDescribeSymbol: () => describeSymbol,
    getItSymbol: () => itSymbol,
    getTestSymbol: () => testSymbol,

    checkTestFile: (file: ts.SourceFile): CheckResult =>
      checkAnalyzeResult(analyzeTestFile(project, file)),
  };

  return project;
}
