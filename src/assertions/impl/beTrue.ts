import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `true`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beTrue); // fail
 * expect<'foo'>().not.to(beTrue); // pass
 * expect<true>().to(beTrue); // pass
 * expect<false>().to(beTrue); // fail
 * expect<boolean>().to(beTrue); // fail
 * ```
 *
 * @since 0.1.1
 */
export const beTrue = match<'beTrue'>();

export const registerToBeTrue = () => {
  registerAnalyzer('beTrue', (actual, _expected, { not }) => {
    const actualText = bold(actual.text);
    const expectedType = bold('true');
    const actualType = bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
