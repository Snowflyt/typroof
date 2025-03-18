import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be equal to the given type.
 * @returns
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(equal<'foo'>); // pass
 * expect<'foo'>().not.to(equal<'foo'>); // fail
 * expect<'foo'>().to(equal('foo')); // pass
 * expect<'foo'>().to(equal<'bar'>); // fail
 * expect<'foo'>().to(equal<'foo' | 'bar'>); // fail
 * ```
 */
export const equal = <U>(y?: U) => match<'equal', U>();

export const registerToEqual = () => {
  registerAnalyzer('equal', (actual, expected, { not, typeChecker }) => {
    const actualText = bold(actual.text);
    const expectedType = bold(typeChecker.typeToString(expected));
    const actualType = bold(typeChecker.typeToString(actual.type));

    throw (
      `Expect ${actualText} ${not ? 'not ' : ''}to equal ${expectedType}, ` +
      `but got ${actualType}.`
    );
  });
};
