import * as ts from 'typescript';

import type { AnalyzerMeta } from '../assertions/matcher';
import { analyzers } from '../assertions/matcher';
import { MatchingError } from '../errors';

import type { AnalyzeResult, Assertion, Group, Test } from './analyze';
import type { TyproofProject } from './project';

export interface GroupResult {
  description: string;
  children: (GroupResult | TestResult)[];
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
  filePathname: string;
  errorLineNumber: number;
  errorColumnNumber: number;
  errorMessage: string;
}

export type AssertionResult = AssertionResultPass | AssertionResultFail;

export interface CheckResult {
  project: TyproofProject;
  sourceFile: ts.SourceFile;
  rootGroupResult: GroupResult;
}

export const checkAnalyzeResult = ({
  diagnostics,
  project,
  rootGroup,
  sourceFile,
}: AnalyzeResult): CheckResult => {
  const result: GroupResult = { description: rootGroup.description, children: [] };

  const checkAssertions = (group: GroupResult, children: readonly (Group | Test)[]) => {
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
          expectedType,
          matcherName,
          matcherNode,
          not,
          passedOrValidationResult,
          statement,
        } = assertion;

        const analyzer = analyzers.get(matcherName);
        if (!analyzer) {
          const { character, line } = sourceFile.getLineAndCharacterOfPosition(
            matcherNode.getStart(sourceFile),
          );
          throw new MatchingError(
            `${rootGroup.description}:${line + 1}:${character + 1} Cannot find analyzer for '${matcherName}'`,
          );
        }

        if (passedOrValidationResult !== true) {
          const typeChecker = project.typeChecker;

          const actual = {
            text:
              ts.isTypeNode(actualNode) ?
                actualNode.getText(sourceFile)
              : `typeof ${actualNode.getText(sourceFile)}`,
            type: typeChecker.getTypeAtLocation(actualNode),
            node: actualNode,
          };

          const meta: AnalyzerMeta = {
            ...(typeof passedOrValidationResult !== 'boolean' ?
              { validationResult: passedOrValidationResult }
            : {}),
            diagnostics,
            not,
            project,
            program: project.program,
            typeChecker,
            sourceFile,
            statement,
          };

          try {
            analyzer(actual, expectedType, meta);
          } catch (error) {
            if (typeof error === 'string') {
              const { character, line } = sourceFile.getLineAndCharacterOfPosition(
                actualNode.getStart(sourceFile),
              );
              const assertionResult: AssertionResultFail = {
                pass: false,
                assertion,
                filePathname: rootGroup.description,
                errorLineNumber: line + 1,
                errorColumnNumber: character + 1,
                errorMessage: error,
              };
              testResult.assertionResults.push(assertionResult);
              continue;
            } else {
              throw error;
            }
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
