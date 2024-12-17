import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `any`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beAny); // fail
 * expect<'foo'>().not.to(beAny); // pass
 * expect<any>().to(beAny); // pass
 * ```
 */
export const beAny = match<'beAny'>();

export const registerToBeAny = () => {
  registerAnalyzer('beAny', (actual, _expected, { not }) => {
    const actualText = bold(actual.text);
    const expectedType = bold('any');
    const actualType = bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
