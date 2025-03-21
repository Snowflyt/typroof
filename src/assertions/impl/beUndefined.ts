import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `undefined`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beUndefined); // fail
 * expect<'foo'>().not.to(beUndefined); // pass
 * expect<undefined>().to(beUndefined); // pass
 * ```
 */
export const beUndefined = match<'beUndefined'>();

export const registerToBeUndefined = () => {
  registerAnalyzer('beUndefined', (actual, _expected, { not, typeChecker }) => {
    const actualText = bold(actual.text);
    const expectedType = bold('undefined');
    const actualType = bold(typeChecker.typeToString(actual.type));

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
