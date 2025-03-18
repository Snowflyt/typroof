import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `never`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beNever); // fail
 * expect<'foo'>().not.to(beNever); // pass
 * expect<never>().to(beNever); // pass
 * ```
 */
export const beNever = match<'beNever'>();

export const registerToBeNever = () => {
  registerAnalyzer('beNever', (actual, _expected, { not, typeChecker }) => {
    const actualText = bold(actual.text);
    const expectedType = bold('never');
    const actualType = bold(typeChecker.typeToString(actual.type));

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
