import { ts } from 'ts-morph';

import { analyzers } from '../assertions/matcher';

import type { AnalyzeResult, Assertion, Group, Test } from './analyze';
import type { TyproofProject } from './project';
import type { SourceFile } from 'ts-morph';

import { MatchingError } from '@/errors';

export interface GroupResult {
  description: string;
  children: Array<GroupResult | TestResult>;
}
export interface TestResult {
  description: string;
  assertionResults: AssertionResult[];
}
export interface AssertionResultPass {
  pass: true;
  assertion: Assertion;
}
export interface AssertionResultFail {
  pass: false;
  assertion: Assertion;
  errorLineNumber: number;
  errorColumnNumber: number;
  errorMessage: string;
}
export type AssertionResult = AssertionResultPass | AssertionResultFail;

export interface CheckResult {
  project: TyproofProject;
  sourceFile: SourceFile;
  rootGroupResult: GroupResult;
}

export const checkAnalyzeResult = ({
  diagnostics,
  project,
  rootGroup,
  sourceFile,
}: AnalyzeResult): CheckResult => {
  const result: GroupResult = { description: rootGroup.description, children: [] };

  const checkAssertions = (group: GroupResult, children: ReadonlyArray<Group | Test>) => {
    const isGroup = (child: Group | Test): child is Group => 'children' in child;

    for (const child of children) {
      if (isGroup(child)) {
        const subGroupResult: GroupResult = { description: child.description, children: [] };
        checkAssertions(subGroupResult, child.children);
        group.children.push(subGroupResult);
        continue;
      }

      const testResult: TestResult = { description: child.description, assertionResults: [] };

      for (const assertion of child.assertions) {
        const {
          actualNode,
          matcherName,
          matcherNode,
          not,
          passedOrValidationResult,
          statement,
          type,
        } = assertion;

        const analyzer = analyzers.get(matcherName);
        if (!analyzer)
          throw new MatchingError(
            `${rootGroup.description}:${matcherNode.getStartLineNumber()}:${
              matcherNode.getStart() - matcherNode.getStartLinePos() + 1
            } Cannot find analyzer for '${matcherName}'`,
          );

        const actual = {
          text: ts.isTypeNode(actualNode.compilerNode)
            ? actualNode.getText()
            : `typeof ${actualNode.getText()}`,
          type: actualNode.getType(),
          node: actualNode,
        };
        const meta = { diagnostics, not, project, sourceFile, statement };

        try {
          analyzer(actual, type, passedOrValidationResult, meta);
        } catch (error) {
          if (typeof error === 'string') {
            const assertionResult: AssertionResultFail = {
              pass: false,
              assertion,
              errorLineNumber: actualNode.getStartLineNumber(),
              errorColumnNumber: actualNode.getStart() - actualNode.getStartLinePos() + 1,
              errorMessage: error,
            };
            testResult.assertionResults.push(assertionResult);
            continue;
          }
        }

        const assertionResult: AssertionResultPass = { pass: true, assertion };
        testResult.assertionResults.push(assertionResult);
      }

      group.children.push(testResult);
    }
  };

  checkAssertions(result, rootGroup.children);

  return { project, sourceFile, rootGroupResult: result };
};
