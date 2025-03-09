import { beFalse, beTrue, describe, equal, expect, it } from 'typroof';

import type { MatchesBoolean } from './boolean';

describe('MatchesBoolean', () => {
  it('should return `true` for `true`, `false` or `boolean`', () => {
    expect<MatchesBoolean<true>>().to(beTrue);
    expect<MatchesBoolean<false>>().to(beTrue);
    expect<MatchesBoolean<boolean>>().to(beTrue);
  });

  it('should return `false` for `never`', () => {
    expect<MatchesBoolean<never>>().to(beFalse);
  });

  it('should return `boolean` for `any`', () => {
    expect<MatchesBoolean<any>>().to(equal<boolean>);
  });

  it('should return `false` for other types', () => {
    expect<MatchesBoolean<'foo' | 'bar'>>().to(beFalse);
    expect<MatchesBoolean<number>>().to(beFalse);
    expect<MatchesBoolean<unknown>>().to(beFalse);
  });
});
