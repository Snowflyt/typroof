import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `null` or `undefined`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beNullish); // fail
 * expect<'foo'>().not.to(beNullish); // pass
 * expect<null>().to(beNullish); // pass
 * expect<undefined>().to(beNullish); // pass
 * ```
 */
export const beNullish = match<'beNullish'>();

export const registerToBeNullish = () => {
  registerAnalyzer('beNullish', (actual, _expected, { not, typeChecker }) => {
    const actualText = bold(actual.text);
    const expectedType =
      bold('null') + ', ' + bold('undefined') + ' or ' + bold('null | undefined');
    const actualType = bold(typeChecker.typeToString(actual.type));

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
