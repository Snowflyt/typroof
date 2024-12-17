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
  registerAnalyzer('error', (actual, _expected, { diagnostics, not, statement }) => {
    const diagnostic = diagnostics.find((diagnostic) => {
      const start = diagnostic.getStart();
      if (!start) return false;
      const length = diagnostic.getLength();
      if (!length) return false;
      const end = start + length;
      return start >= actual.node.getStart() && end <= actual.node.getEnd();
    });

    const triggeredError =
      !!diagnostic ||
      // Check if the error is suppressed by `@ts-expect-error`
      statement.getLeadingCommentRanges().some(
        (range) =>
          range
            .getText()
            .replace(/^\/\*+\s*/, '')
            .replace(/^\/\/\s*/, '')
            .startsWith('@ts-expect-error') &&
          !diagnostics.find((diagnostic) => diagnostic.getStart() === range.getPos()),
      );

    if (not ? triggeredError : !triggeredError) {
      const actualText = bold(actual.text);
      throw (
        `Expect ${actualText} ${not ? 'not ' : ''}to trigger error, ` +
        `but ${not ? 'did' : 'did not'}.`
      );
    }
  });
};
