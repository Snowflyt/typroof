/* eslint-disable no-irregular-whitespace */

import path from 'node:path';

import chalk from 'chalk';
import { ts } from 'ts-morph';

import { isCallOfSymbol, isCallOfSymbols } from './ts';

import type { TyproofProject } from './project';
import type { CallExpression, Diagnostic, Node, SourceFile, Type } from 'ts-morph';

export interface Group {
  description: string;
  children: Array<Group | Test>;
}
export interface Test {
  description: string;
  assertions: Assertion[];
}
export interface Assertion {
  statement: CallExpression<ts.CallExpression>;
  actualNode: Node<ts.Node>;
  matcherName: string;
  not: boolean;
  type: Type<ts.Type>;
  passedOrValidationResult: boolean | Type<ts.Type>;
}

export interface AnalyzeResult {
  project: TyproofProject;
  sourceFile: SourceFile;
  diagnostics: readonly Diagnostic<ts.Diagnostic>[];
  rootGroup: Group;
}

export const analyzeTestFile = (project: TyproofProject, file: SourceFile): AnalyzeResult => {
  const expectSymbol = project.getExpectSymbol();
  const describeSymbol = project.getDescribeSymbol();
  const itSymbol = project.getItSymbol();
  const testSymbol = project.getTestSymbol();

  const getPrettifiedPathName = (file: SourceFile) => {
    const filePathName = path.relative(process.cwd(), file.getFilePath()).replace(/\\/g, '/');
    const filePath = path.dirname(filePathName);
    const fileNameWithExt = path.basename(filePathName);
    let ext = path.extname(filePathName);
    let fileName = fileNameWithExt.slice(0, -ext.length);
    if (path.extname(fileName) === '.proof') {
      ext = path.extname(fileName) + ext;
      fileName = fileNameWithExt.slice(0, -ext.length);
    }
    return (filePath !== '.' ? chalk.dim(filePath + '/') : '') + fileName + chalk.dim(ext);
  };

  const result: Group = { description: getPrettifiedPathName(file), children: [] };

  const topLevelDescribeCalls = file
    .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
    .filter(isCallOfSymbol(describeSymbol))
    .filter((call) => !call.getAncestors().some(isCallOfSymbol(describeSymbol)));
  const topLevelTestCalls = file
    .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
    .filter(isCallOfSymbols([testSymbol, itSymbol]))
    .filter((call) => !call.getAncestors().some(isCallOfSymbol(describeSymbol)));
  const topLevelDescribeOrTestCalls = [...topLevelDescribeCalls, ...topLevelTestCalls].sort(
    (a, b) => a.getStart() - b.getStart(),
  );

  const extractAssertions = (group: Group, calls: readonly CallExpression<ts.CallExpression>[]) => {
    const getChildDescribeOrTestCalls = (describe: CallExpression<ts.CallExpression>) =>
      describe
        .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
        .filter(
          (call) =>
            isCallOfSymbols([testSymbol, itSymbol])(call) ||
            (isCallOfSymbol(describeSymbol)(call) &&
              call.getAncestors().find(isCallOfSymbol(describeSymbol)) === describe),
        );

    const getDescribeOrTestCallDescription = (call: CallExpression<ts.CallExpression>) =>
      call.getArguments()[0]!.getText().trim().replace(/^['"]/, '').replace(/['"]$/, '');

    for (const call of calls) {
      if (isCallOfSymbol(describeSymbol)(call)) {
        const description = getDescribeOrTestCallDescription(call);
        const subGroup: Group = { description, children: [] };
        extractAssertions(subGroup, getChildDescribeOrTestCalls(call));
        group.children.push(subGroup);
        continue;
      }

      const description = getDescribeOrTestCallDescription(call);
      const body = call.getArguments()[1]!;
      const expectCalls = body
        .getDescendantsOfKind(ts.SyntaxKind.CallExpression)
        .filter(isCallOfSymbol(expectSymbol));

      const test: Test = { description, assertions: [] };

      for (const call of expectCalls) {
        const actualNode = call.getTypeArguments()[0] ?? call.getArguments()[0];
        if (!actualNode) continue;

        let access = call.getParentIfKind(ts.SyntaxKind.PropertyAccessExpression);
        if (!access) continue;

        let not = false;

        if (access.getName() === 'not' && access.getType().getCallSignatures().length === 0) {
          access = access.getParentIfKind(ts.SyntaxKind.PropertyAccessExpression)!;
          not = true;
        }

        if (access.getType().getCallSignatures().length === 0) continue;

        const toCall = access.getParentIfKind(ts.SyntaxKind.CallExpression)!;

        const matcher = toCall.getArguments()[0]!;
        const match =
          matcher.getType().getCallSignatures().length > 0
            ? matcher.getType().getCallSignatures()[0]!.getReturnType()
            : matcher.getType();
        const matcherName = match.getTypeArguments()[0]!.getText().slice(1, -1);
        const type = match.getTypeArguments()[1]!;
        const passedOrValidationResult =
          toCall.getReturnType().getText() === '"pass"'
            ? true
            : toCall.getReturnType().getText() === '"fail"'
            ? false
            : toCall.getReturnType().getTypeArguments()[0]!;

        test.assertions.push({
          statement: toCall,
          actualNode,
          matcherName,
          not,
          type,
          passedOrValidationResult,
        });
      }

      group.children.push(test);
    }
  };

  extractAssertions(result, topLevelDescribeOrTestCalls);

  return {
    project,
    sourceFile: file,
    diagnostics: project.cachedPreEmitDiagnostics.filter((d) => d.getSourceFile() === file),
    rootGroup: result,
  };
};
