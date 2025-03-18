import { bold, dim, gray, green, red, yellow } from '../utils/colors';

import type { GroupResult, TestResult } from './check';

const formatTestResult = (test: TestResult, indent: number): string => {
  let result = '';

  const icon = test.assertionResults.some((a) => !a.pass) ? red('×') : green('✓');
  result += ' '.repeat(indent) + `${icon} ${test.description}\n`;

  for (const assertion of test.assertionResults) {
    if (assertion.pass) continue;
    result +=
      ' '.repeat(indent + 2) +
      red('×') +
      ' ' +
      gray(assertion.errorLineNumber + ':' + assertion.errorColumnNumber) +
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
export function formatGroupResult(group: GroupResult, indent = 0): string {
  let result = '';

  const icon = groupHasFails(group) ? yellow('❯') : green('✓');
  const tests = groupTestCount(group);
  result += ' '.repeat(indent) + `${icon} ${group.description} ${dim('(' + tests + ')')}\n`;

  for (const child of group.children)
    if (isTestResult(child)) result += formatTestResult(child, indent + 2) + '\n';
    else result += formatGroupResult(child, indent + 2) + '\n';

  return result.trimEnd();
}

/**
 * Get a summary of the test results.
 * @param groups The groups of test results.
 * @returns
 */
export function summary(groups: readonly GroupResult[]) {
  let testFileFailed = 0;
  let testCount = 0;
  let testFailed = 0;

  for (const group of groups) {
    if (groupHasFails(group)) testFileFailed++;
    testCount += groupTestCount(group);
    testFailed += groupFailCount(group);
  }

  return { testFileCount: groups.length, testFileFailed, testCount, testFailed };
}

/**
 * Format a summary of the test results.
 * @param options Options for formatting the summary.
 * @returns
 */
export function formatSummary(options: {
  groups: readonly GroupResult[];
  startedAt?: Date;
  finishedAt?: Date;
}): string {
  const { finishedAt, groups, startedAt } = options;

  let result = '';

  const { testCount, testFailed, testFileFailed } = summary(groups);

  result +=
    dim(' Test Files  ') +
    (testFileFailed > 0 ?
      bold(red(testFileFailed + ' failed')) + (groups.length - testFileFailed > 0 ? ' | ' : '')
    : '') +
    (groups.length - testFileFailed > 0 ?
      bold(green(groups.length - testFileFailed + ' passed'))
    : '') +
    ' ' +
    gray(`(${groups.length})`) +
    '\n';
  result +=
    dim('      Tests  ') +
    (testFailed > 0 ?
      bold(red(testFailed + ' failed')) + (testCount - testFailed > 0 ? ' ' + gray('|') + ' ' : '')
    : '') +
    (testCount - testFailed > 0 ? bold(green(testCount - testFailed + ' passed')) : '') +
    ' ' +
    gray(`(${testCount})`) +
    '\n';
  if (startedAt) {
    const startAtRepresentation =
      String(startedAt.getHours()).padStart(2, '0') +
      ':' +
      String(startedAt.getMinutes()).padStart(2, '0') +
      ':' +
      String(startedAt.getSeconds()).padStart(2, '0');
    result += dim('   Start at  ') + startAtRepresentation + '\n';
  }
  if (startedAt && finishedAt)
    result +=
      dim('   Duration  ') + String(Math.round(finishedAt.getTime() - startedAt.getTime())) + 'ms';

  return result;
}
