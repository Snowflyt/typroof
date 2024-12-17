import { bold } from '../../utils/colors';
import { match, registerAnalyzer } from '../matcher';

/**
 * [Matcher] Expect a type to be `false`.
 *
 * @example
 * ```typescript
 * expect<'foo'>().to(beFalse); // fail
 * expect<'foo'>().not.to(beFalse); // pass
 * expect<true>().to(beFalse); // fail
 * expect<false>().to(beFalse); // pass
 * expect<boolean>().to(beFalse); // fail
 * ```
 *
 * @since 0.1.1
 */
export const beFalse = match<'beFalse'>();

export const registerToBeFalse = () => {
  registerAnalyzer('beFalse', (actual, _expected, { not }) => {
    const actualText = bold(actual.text);
    const expectedType = bold('false');
    const actualType = bold(actual.type.getText());

    throw `Expect ${actualText} ${not ? 'not ' : ''}to be ${expectedType}, but got ${actualType}.`;
  });
};
