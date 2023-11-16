import chalk from 'chalk';

import type { GroupResult, TestResult } from './check';

const formatTestResult = (test: TestResult, indent: number): string => {
  let result = '';

  const icon = test.assertionResults.some((a) => !a.pass) ? chalk.red('✘') : chalk.green('✔');
  result += ' '.repeat(indent) + `${icon} ${test.description}\n`;

  for (const assertion of test.assertionResults) {
    if (assertion.pass) continue;
    result +=
      ' '.repeat(indent + 2) +
      chalk.red('×') +
      ' ' +
      chalk.gray(assertion.errorLineNumber) +
      chalk.hex('#696969')(':') +
      chalk.gray(assertion.errorColumnNumber) +
      ' ' +
      assertion.errorMessage +
      '\n';
  }

  return result.trimEnd();
};

const isTestResult = (result: GroupResult | TestResult): result is TestResult =>
  'assertionResults' in result;

const groupHasFails = (group: GroupResult): boolean => {
  for (const child of group.children)
    if (isTestResult(child)) {
      if (child.assertionResults.some((a) => !a.pass)) return true;
    } else {
      if (groupHasFails(child)) return true;
    }
  return false;
};

const groupTestCount = (group: GroupResult): number =>
  group.children.reduce(
    (count, child) => count + (isTestResult(child) ? 1 : groupTestCount(child)),
    0,
  );

const groupFailCount = (group: GroupResult): number => {
  let count = 0;
  for (const child of group.children)
    if (isTestResult(child)) count += child.assertionResults.filter((a) => !a.pass).length;
    else count += groupFailCount(child);
  return count;
};

/**
 * Format a group of test results.
 * @param group The group of test results to format.
 * @param indent The indentation level. Defaults to `0`.
 * @returns
 */
export const formatGroupResult = (group: GroupResult, indent = 0): string => {
  let result = '';

  const icon = groupHasFails(group) ? chalk.hex('#808000')('❯') : chalk.green('✔');
  const tests = groupTestCount(group);
  result += ' '.repeat(indent) + `${icon} ${group.description} ${chalk.dim(`(${tests})`)}\n`;

  for (const child of group.children)
    if (isTestResult(child)) result += formatTestResult(child, indent + 2) + '\n';
    else result += formatGroupResult(child, indent + 2) + '\n';

  return result.trimEnd();
};

/**
 * Format a summary of the test results.
 * @param options Options for formatting the summary.
 * @returns
 */
export const formatSummary = (options: {
  groups: readonly GroupResult[];
  startedAt?: Date;
  finishedAt?: Date;
}): string => {
  const { finishedAt, groups, startedAt } = options;

  let result = '';

  let testFileFailed = 0;
  let testCount = 0;
  let testFailed = 0;

  for (const group of groups) {
    if (groupHasFails(group)) testFileFailed++;
    testCount += groupTestCount(group);
    testFailed += groupFailCount(group);
  }

  result +=
    chalk.dim(' Test Files  ') +
    (testFileFailed > 0
      ? chalk.bold.red(testFileFailed + ' failed') +
        (groups.length - testFileFailed > 0 ? ' | ' : '')
      : '') +
    (groups.length - testFileFailed > 0
      ? chalk.bold.green(groups.length - testFileFailed + ' passed')
      : '') +
    ' ' +
    chalk.gray(`(${groups.length})`) +
    '\n';
  result +=
    chalk.dim('      Tests  ') +
    (testFailed > 0
      ? chalk.bold.red(testFailed + ' failed') +
        (testCount - testFailed > 0 ? ' ' + chalk.gray('|') + ' ' : '')
      : '') +
    (testCount - testFailed > 0 ? chalk.bold.green(testCount - testFailed + ' passed') : '') +
    ' ' +
    chalk.gray(`(${testCount})`) +
    '\n';
  if (startedAt) {
    const startAtRepresentation =
      String(startedAt.getHours()).padStart(2, '0') +
      ':' +
      String(startedAt.getMinutes()).padStart(2, '0') +
      ':' +
      String(startedAt.getSeconds()).padStart(2, '0');
    result += chalk.dim('   Start at  ') + startAtRepresentation + '\n';
  }
  if (startedAt && finishedAt)
    result +=
      chalk.dim('   Duration  ') +
      String(Math.round(finishedAt.getTime() - startedAt.getTime())) +
      'ms';

  return result;
};
