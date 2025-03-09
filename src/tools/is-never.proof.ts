import { beFalse, beTrue, describe, expect, it } from 'typroof';

import type { IsNever } from './is-never';

describe('IsNever', () => {
  it('should return `true` for `never`', () => {
    expect<IsNever<never>>().to(beTrue);
  });

  it('should return `false` for `any`', () => {
    expect<IsNever<any>>().to(beFalse);
  });

  it('should return `false` for other types', () => {
    expect<IsNever<'foo' | 'bar'>>().to(beFalse);
    expect<IsNever<number>>().to(beFalse);
    expect<IsNever<unknown>>().to(beFalse);
  });
});
