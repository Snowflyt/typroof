import path from 'node:path';

import { globSync } from 'tinyglobby';
import * as ts from 'typescript';

import { blue, cyan, gray, green, red, yellow } from 'src/utils/colors';

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
  readonly checkFiles: readonly ts.SourceFile[];
  readonly diagnostics: readonly ts.Diagnostic[];

  // Symbol getters
  readonly getExpectSymbol: () => ts.Symbol;
  readonly getDescribeSymbol: () => ts.Symbol;
  readonly getItSymbol: () => ts.Symbol;
  readonly getTestSymbol: () => ts.Symbol;

  // Testing functionality
  readonly performTypeCheck: (file: ts.SourceFile) => readonly string[];
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
   * Whether to perform a type check on the test files before running tests.
   * @default false
   */
  check?: boolean;
  /* eslint-disable no-irregular-whitespace */
  /**
   * File glob or globs to check for type errors.
   * @default ['**​/*.proof.{ts,tsx}', 'proof/**​/*.{ts,tsx}']
   */
  /* eslint-enable no-irregular-whitespace */
  checkFiles?: string | readonly string[];
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
    check = false,
    checkFiles: checkFilesGlob,
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

  let checkFilePaths: readonly string[] = [];
  if (check) {
    checkFilePaths = testFilePaths;
    if (checkFilesGlob && checkFilesGlob.length > 0)
      checkFilePaths = globSync(checkFilesGlob as string | string[], {
        ignore: 'node_modules/**',
      });
  }

  // Create program
  const program = ts.createProgram(
    [...new Set(testFilePaths.concat(checkFilePaths))],
    parsedConfig.options,
  );

  const typeChecker = program.getTypeChecker();
  const diagnostics = ts.getPreEmitDiagnostics(program);
  const testFiles = program
    .getSourceFiles()
    .filter((file) => testFilePaths.includes(file.fileName));
  const checkFiles = program
    .getSourceFiles()
    .filter((file) => checkFilePaths.includes(file.fileName));

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
    checkFiles,
    diagnostics,

    getExpectSymbol: () => expectSymbol,
    getDescribeSymbol: () => describeSymbol,
    getItSymbol: () => itSymbol,
    getTestSymbol: () => testSymbol,

    performTypeCheck: (file) => {
      const messages: string[] = [];
      for (const diagnostic of ts.getPreEmitDiagnostics(program, file))
        if (diagnostic.file) {
          const { character, line } = ts.getLineAndCharacterOfPosition(
            diagnostic.file,
            diagnostic.start!,
          );
          const message =
            `${cyan(diagnostic.file.fileName)}:${yellow(String(line + 1))}:${yellow(String(character + 1))} - ` +
            `${
              diagnostic.category === ts.DiagnosticCategory.Error ? red('error')
              : diagnostic.category === ts.DiagnosticCategory.Warning ? yellow('warning')
              : diagnostic.category === ts.DiagnosticCategory.Suggestion ? blue('suggestion')
              : green('message')
            } ` +
            `${gray('TS' + diagnostic.code)}: ` +
            ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
          messages.push(message);
        } else {
          messages.push(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        }
      return messages;
    },
    checkTestFile: (file) => checkAnalyzeResult(analyzeTestFile(project, file)),
  };

  return project;
}
