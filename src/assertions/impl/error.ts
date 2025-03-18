import * as ts from 'typescript';

import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a pre emitted diagnostic between the start and end of the given type.
 *
 * @example
 * ```typescript
 * type IdNumber<N extends number> = N;
 * expect<IdNumber<'foo'>>().to(error); // pass
 * //              ~~~~~
 * //  Type '"foo"' is not assignable to type 'number'.
 * expect<IdNumber<42>>().to(error); // fail
 * expect<IdNumber<42>>().not.to(error); // pass
 * ```
 */
export const error = match<'error'>();

export const registerToError = () => {
  registerAnalyzer('error', (actual, _expected, { diagnostics, not, sourceFile, statement }) => {
    // Check if a diagnostic error exists for this node
    const diagnostic = diagnostics.find((diagnostic) => {
      const start = diagnostic.start;
      if (start === undefined) return false;

      const length = diagnostic.length;
      if (length === undefined) return false;

      const end = start + length;
      const nodeStart = actual.node.getStart(sourceFile);
      const nodeEnd = actual.node.getEnd();

      return start >= nodeStart && end <= nodeEnd;
    });

    // Find @ts-expect-error comments that apply to this expression
    const findTSExpectError = () => {
      const sourceText = sourceFile.text;

      // 1. Check for leading comments directly before the statement
      const leadingComments =
        ts.getLeadingCommentRanges(sourceText, statement.getFullStart()) || [];

      // 2. Find any internal comments within the statement’s full text range
      // This helps with multi-line expressions that have inline comments
      const statementStart = statement.getFullStart();
      const statementEnd = statement.getEnd();
      const statementText = sourceText.substring(statementStart, statementEnd);

      // Track all potential comment positions
      const commentPositions: { start: number; end: number }[] = [
        ...leadingComments.map((c) => ({ start: c.pos, end: c.end })),
      ];

      // Scan the statement for possible comment starts
      let pos = 0;
      while (pos < statementText.length) {
        // Look for // comments
        if (statementText.substring(pos, pos + 2) === '//') {
          const startPos = statementStart + pos;
          let endPos = statementText.indexOf('\n', pos);
          if (endPos === -1) endPos = statementText.length;
          commentPositions.push({
            start: startPos,
            end: statementStart + endPos,
          });
          pos = endPos + 1;
          continue;
        }

        // Look for /* */ comments
        if (statementText.substring(pos, pos + 2) === '/*') {
          const startPos = statementStart + pos;
          const endPos = statementText.indexOf('*/', pos);
          if (endPos !== -1) {
            commentPositions.push({
              start: startPos,
              end: statementStart + endPos + 2,
            });
            pos = endPos + 2;
            continue;
          }
        }

        pos++;
      }

      // Check all comment positions for @ts-expect-error
      for (const { end, start } of commentPositions) {
        const commentText = sourceText.substring(start, end);
        if (commentText.includes('@ts-expect-error')) {
          // Ensure this @ts-expect-error is not already used by checking
          // if there’s a diagnostic that starts at this exact position
          const isUnused = !diagnostics.some(
            (d) => d.start === start && d.code === 2578, // TypeScript’s code for @ts-expect-error
          );
          if (isUnused) return true;
        }
      }

      return false;
    };

    // Check if error is triggered either by diagnostic or @ts-expect-error
    const triggeredError = !!diagnostic || findTSExpectError();

    if (not ? triggeredError : !triggeredError) {
      const actualText = bold(actual.text);
      throw (
        `Expect ${actualText} ${not ? 'not ' : ''}to trigger error, ` +
        `but ${not ? 'did' : 'did not'}.`
      );
    }
  });
};
