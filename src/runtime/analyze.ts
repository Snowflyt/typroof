import path from 'node:path';

import * as ts from 'typescript';

import { AnalyzingError } from '../errors';
import { dim } from '../utils/colors';

import type { TyproofProject } from './project';
import { findNodes, getAncestors, isInvocationOf } from './ts-utils';

export interface Group {
  description: string;
  children: (Group | Test)[];
}
export interface Test {
  description: string;
  assertions: Assertion[];
}
export interface Assertion {
  statement: ts.CallExpression;
  actualNode: ts.Node;
  matcherNode: ts.Node;
  matcherName: string;
  not: boolean;
  expectedType: ts.Type;
  passedOrValidationResult: boolean | ts.Type;
}

export interface AnalyzeResult {
  project: TyproofProject;
  sourceFile: ts.SourceFile;
  diagnostics: readonly ts.Diagnostic[];
  rootGroup: Group;
}

export const analyzeTestFile = (project: TyproofProject, file: ts.SourceFile): AnalyzeResult => {
  const { typeChecker } = project;
  const expectSymbol = project.getExpectSymbol();
  const describeSymbol = project.getDescribeSymbol();
  const itSymbol = project.getItSymbol();
  const testSymbol = project.getTestSymbol();

  const getPrettifiedPathName = (file: ts.SourceFile) => {
    const filePathName = path.relative(process.cwd(), file.fileName).replace(/\\/g, '/');
    const filePath = path.dirname(filePathName);
    let fileName = path.basename(filePathName);
    let exts = '';
    let ext = '';
    while ((ext = path.extname(fileName))) {
      exts = ext + exts;
      fileName = fileName.slice(0, -ext.length);
    }
    return (filePath !== '.' ? dim(filePath + '/') : '') + fileName + dim(exts);
  };

  const result: Group = { description: getPrettifiedPathName(file), children: [] };

  // Find call expressions in the source file
  const allCalls = findNodes(file, ts.isCallExpression);

  // Check if a node is a call to a specific symbol
  const isCallTo = (node: ts.Node, symbols: ts.Symbol | ts.Symbol[]): boolean =>
    ts.isCallExpression(node) &&
    isInvocationOf(typeChecker, node, Array.isArray(symbols) ? symbols : [symbols]);

  // Check if a node has an ancestor that is a call to a specific symbol
  const hasAncestorCallTo = (node: ts.Node, symbol: ts.Symbol): boolean =>
    getAncestors(node).some((ancestor) => isCallTo(ancestor, symbol));

  // Find top level describe calls
  const topLevelDescribeCalls = allCalls
    .filter((call) => isCallTo(call, describeSymbol))
    .filter((call) => !hasAncestorCallTo(call, describeSymbol));

  // Find top level test calls
  const topLevelTestCalls = allCalls
    .filter((call) => isCallTo(call, [testSymbol, itSymbol]))
    .filter((call) => !hasAncestorCallTo(call, describeSymbol));

  // Combine and sort by position
  const topLevelDescribeOrTestCalls = [...topLevelDescribeCalls, ...topLevelTestCalls].sort(
    (a, b) => a.getStart() - b.getStart(),
  );

  const extractAssertions = (group: Group, calls: readonly ts.CallExpression[]) => {
    // Find child describe or test calls within a describe block
    const getChildDescribeOrTestCalls = (describe: ts.CallExpression): ts.CallExpression[] => {
      // Get all descendant call expressions
      const descendantCalls = findNodes(describe, ts.isCallExpression);

      return descendantCalls.filter((call) => {
        const isTestOrIt = isCallTo(call, [testSymbol, itSymbol]);
        const isNestedDescribe =
          isCallTo(call, describeSymbol) &&
          getAncestors(call).find((a) => isCallTo(a, describeSymbol)) === describe;

        return (
          (isTestOrIt || isNestedDescribe) &&
          getAncestors(call).find((a) => isCallTo(a, describeSymbol)) === describe
        );
      });
    };

    // Get the description string from a call (first argument)
    const getDescribeOrTestCallDescription = (call: ts.CallExpression): string => {
      const arg = call.arguments[0];
      if (!arg) {
        const { character, line } = file.getLineAndCharacterOfPosition(call.getStart(file));
        throw new AnalyzingError(
          `${result.description}:${line + 1}:${character + 1} No description provided for ${call.expression.getText(
            file,
          )} call`,
        );
      }
      if (ts.isStringLiteral(arg)) return arg.text;
      return arg.getText(file).trim().replace(/^['"]/, '').replace(/['"]$/, '');
    };

    for (const call of calls) {
      if (isCallTo(call, describeSymbol)) {
        const description = getDescribeOrTestCallDescription(call);
        const subGroup: Group = { description, children: [] };
        extractAssertions(subGroup, getChildDescribeOrTestCalls(call));
        group.children.push(subGroup);
        continue;
      }

      const description = getDescribeOrTestCallDescription(call);

      // Find the function body (second argument)
      const body = call.arguments[1];
      if (!body || (!ts.isArrowFunction(body) && !ts.isFunctionExpression(body))) {
        continue;
      }

      // Find expect calls in the function body
      const expectCalls = findNodes(body, ts.isCallExpression).filter((call) =>
        isCallTo(call, expectSymbol),
      );

      const test: Test = { description, assertions: [] };

      for (const call of expectCalls) {
        // Get the actual value (type argument or first argument)
        const actualNode = call.typeArguments?.[0] ?? call.arguments[0];
        if (!actualNode) continue;

        // Find property access (`.not.to(...)`, `.to(...)`, etc.)
        let access: ts.PropertyAccessExpression | undefined = undefined;
        let current: ts.Node | undefined = call;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        while (current && !access) {
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          if (current.parent && ts.isPropertyAccessExpression(current.parent)) {
            access = current.parent;
            break;
          }
          current = current.parent;
        }

        if (!access) continue;

        let not = false;

        // Handle `.not` property
        if (access.name.text === 'not') {
          const callSignatures = typeChecker.getTypeAtLocation(access).getCallSignatures();
          if (callSignatures.length === 0) {
            // Find the next property access (.not.toEqual)
            const nextAccess = access.parent;
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (nextAccess && ts.isPropertyAccessExpression(nextAccess)) {
              access = nextAccess;
              not = true;
            }
          }
        }

        const toCallSignatures = typeChecker.getTypeAtLocation(access).getCallSignatures();
        if (toCallSignatures.length === 0) continue;

        // Find the call to the matcher
        let toCall: ts.CallExpression | undefined = undefined;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (access.parent && ts.isCallExpression(access.parent)) {
          toCall = access.parent;
        }

        if (!toCall) continue;

        const matcher = toCall.arguments[0];
        if (!matcher) {
          const { character, line } = file.getLineAndCharacterOfPosition(access.getStart(file));
          throw new AnalyzingError(
            `${result.description}:${line + 1}:${character + 1} No matcher provided for expect statement`,
          );
        }

        // Get matcher type information
        const matcherType = typeChecker.getTypeAtLocation(matcher);
        const matcherCallSignatures = matcherType.getCallSignatures();

        // Get match type (either return type of matcher call or matcher type itself)
        const match =
          matcherCallSignatures.length > 0 ?
            matcherCallSignatures[0]!.getReturnType()
          : matcherType;

        // Get type arguments of the match
        const typeArgs = typeChecker.getTypeArguments(match as ts.TypeReference);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!typeArgs || typeArgs.length === 0) {
          const { character, line } = file.getLineAndCharacterOfPosition(matcher.getStart(file));
          throw new AnalyzingError(
            `${result.description}:${line + 1}:${character + 1} '${matcher.getText(file)}' is not a valid matcher`,
          );
        }

        // Extract matcher name and expected type
        const matcherName = typeChecker.typeToString(typeArgs[0]!).slice(1, -1);
        const expectedType = typeArgs[1]!;

        // Determine if test passed
        const returnType = typeChecker.getTypeAtLocation(toCall);
        const returnTypeString = typeChecker.typeToString(returnType);

        const passedOrValidationResult =
          returnTypeString === '"pass"' ? true
          : returnTypeString === '"fail"' ? false
          : typeChecker.getTypeArguments(returnType as ts.TypeReference)[0]!;

        test.assertions.push({
          statement: toCall,
          actualNode,
          matcherNode: matcher,
          matcherName,
          not,
          expectedType,
          passedOrValidationResult,
        });
      }

      if (test.assertions.length > 0) group.children.push(test);
    }
  };

  extractAssertions(result, topLevelDescribeOrTestCalls);

  return {
    project,
    sourceFile: file,
    diagnostics: project.diagnostics.filter((d) => d.file === file),
    rootGroup: result,
  };
};
